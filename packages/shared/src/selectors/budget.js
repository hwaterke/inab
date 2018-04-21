// @flow
import R from 'ramda';
import moment from 'moment';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared';
import type {Transaction} from '../entities/Transaction';
import {TransactionResource} from '../entities/Transaction';
import {sumOfAmounts, beginningOfMonth} from './utils';
import type {Account} from '../entities/Account';
import {AccountResource} from '../entities/Account';
import type {Category} from '../entities/Category';
import {CategoryResource} from '../entities/Category';
import type {BudgetItem} from '../entities/BudgetItem';
import {BudgetItemResource} from '../entities/BudgetItem';
import {getSelectedMonthMoment, getPreviousMonthMoment} from './month';
import {
  budgetItemsInMonth,
  getBudgetItemsSumUpToPreviousMonth,
  budgetItemsUpToMonth,
  getSelectedMonthBudgetItemByCategoryId
} from './budgetItems';
import {
  getToBeBudgetedSumUpToSelectedMonth,
  transactionsUpToMonth,
  flattenTransactions
} from './transactions';

/**
 * Returns the balance of the budget i.e. the total amount of money across accounts.
 */
export const getBudgetBalance = createSelector(
  arraySelector(TransactionResource),
  (transactions: Transaction[]) => sumOfAmounts(transactions.filter(t => !t.transfer_account_uuid))
);

/**
 * Returns the balance per account
 */
export const selectBalanceByAccountId = createSelector(
  arraySelector(AccountResource),
  arraySelector(TransactionResource),
  (accounts: Account[], transactions: Transaction[]) => {
    const withTransferAccount = R.filter(R.prop('transfer_account_uuid'));
    const reduceToAmountSumBy = R.reduceBy((acc, record) => acc + record.amount, 0);
    const sumByAccountId = reduceToAmountSumBy(R.prop('account_uuid'));
    const sumByTransferAccountId = reduceToAmountSumBy(R.prop('transfer_account_uuid'));
    return R.mergeWith(
      (a, b) => a - b,
      sumByAccountId(transactions),
      sumByTransferAccountId(withTransferAccount(transactions))
    );
  }
);

/**
 * Returns the sum of all budget items and transactions by category and by month (chronological)
 */
const sumOfBudgetItemsAndTransactionsByCategoryByMonth = createSelector(
  arraySelector(CategoryResource),
  arraySelector(BudgetItemResource),
  arraySelector(TransactionResource),
  (categories: Category[], budgetItems: BudgetItem[], transactions: Transaction[]) => {
    const result = new Map();

    // Initialize the result for each existing category.
    categories.forEach(c => result.set(c.uuid, new Map()));

    budgetItems.forEach(bi => {
      const categoryResult = result.get(bi.category_uuid) || new Map();
      categoryResult.set(bi.month, (categoryResult.get(bi.month) || 0) + bi.amount);
    });

    flattenTransactions(transactions).forEach(ft => {
      const month = beginningOfMonth(ft.date);
      const categoryResult = result.get(ft.category_uuid) || new Map();
      categoryResult.set(month, (categoryResult.get(month) || 0) + ft.amount);
    });

    // Sort the result chronologically
    const sortedResult = new Map();
    result.forEach((g, category_uuid) => {
      const sortedMonth = new Map();
      Array.from(g.keys())
        .sort()
        .forEach(m => sortedMonth.set(m, g.get(m)));
      sortedResult.set(category_uuid, sortedMonth);
    });

    return sortedResult;
  }
);

/**
 * Returns overspendings by category and by month
 */
const getOverspendingByCategoryIdByMonth = createSelector(
  sumOfBudgetItemsAndTransactionsByCategoryByMonth,
  input => {
    const overspendings = new Map();
    input.forEach((g, category_uuid) => {
      let sumAccrossMonths = 0;
      g.forEach((value, month) => {
        sumAccrossMonths += value;
        if (sumAccrossMonths < 0) {
          // Make sure there is a Map for this category.
          if (!overspendings.get(category_uuid)) {
            overspendings.set(category_uuid, new Map());
          }

          // Extract Map to make Flow understand it is not undefined
          const categoryMap = overspendings.get(category_uuid);
          if (categoryMap) {
            // Add the overspending to the Map for this category.
            categoryMap.set(month, sumAccrossMonths);
          } else {
            throw new Error('This should not happen');
          }

          sumAccrossMonths = 0;
        }
      });
    });
    return overspendings;
  }
);

// Returns for each category the amount available in the budget for that category for the month
export const getAvailableByCategoryIdForSelectedMonth = createSelector(
  arraySelector(CategoryResource),
  budgetItemsUpToMonth.selected,
  transactionsUpToMonth.selected,
  getSelectedMonthMoment,
  getOverspendingByCategoryIdByMonth,
  (categories, budgetItems, transactions, currentMonth, overspendings) => {
    const result = new Map();

    // Initialize the result for each existing category.
    categories.forEach(c => result.set(c.uuid, 0));

    const groupedBudgetItems = R.groupBy(R.prop('category_uuid'), budgetItems);
    R.forEachObjIndexed((v, category_uuid) => {
      result.set(category_uuid, result.get(category_uuid) + sumOfAmounts(v));
    }, groupedBudgetItems);

    flattenTransactions(transactions).forEach(ft => {
      result.set(ft.category_uuid, result.get(ft.category_uuid) + ft.amount);
    });

    // Overspending handling. The overspending is moved to the funds available for next month.
    overspendings.forEach((v, category_uuid) => {
      v.forEach((overspending, month) => {
        // Only up to last month
        if (currentMonth.isAfter(month)) {
          result.set(category_uuid, (result.get(category_uuid) || 0) - overspending);
        }
      });
    });

    return result;
  }
);

// Funds for the month
export const getFundsForSelectedMonth = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSumUpToPreviousMonth,
  getSelectedMonthMoment,
  getOverspendingByCategoryIdByMonth,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum, currentMonth, overspendings) => {
    let total = 0;

    // Add inflow for the month
    total += toBeBudgetedSumUpToSelectedMonth;

    // Remove money already budgeted in previous months
    total -= budgetItemsSum;

    // Add all the overspendings from previous months (coupel of months old)
    const twoMonthsBack = currentMonth.clone().subtract(2, 'months');
    overspendings.forEach(v => {
      v.forEach((overspending, month) => {
        // Only for overspending at least 2 month old.
        if (twoMonthsBack.isSameOrAfter(month)) {
          total += overspending;
        }
      });
    });

    return total;
  }
);

// Overspent last month
export const getOverspentLastMonth = createSelector(
  getPreviousMonthMoment,
  getOverspendingByCategoryIdByMonth,
  (previousMonth, overspendings) => {
    let total = 0;
    overspendings.forEach(v => {
      v.forEach((overspending, month) => {
        // Only for last month
        if (previousMonth.isSame(month)) {
          total += overspending;
        }
      });
    });
    return total;
  }
);

// Budgeted this month
export const getBudgetedThisMonth = createSelector(
  budgetItemsInMonth.selected,
  items => -sumOfAmounts(items)
);

// Budgeted in the future
export const getBudgetedInFuture = createSelector(
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getSelectedMonthMoment,
  arraySelector(BudgetItemResource),
  (funds, overspent: number, budgeted, currentMonth, allBudgetItems) => {
    const maximum = funds + overspent + budgeted;
    const futureBudgeting = sumOfAmounts(
      allBudgetItems.filter(i => currentMonth.isBefore(i.month))
    );
    return Math.min(0, -Math.min(maximum, futureBudgeting));
  }
);

// Available to budget
export const getAvailableToBudget = createSelector(
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getBudgetedInFuture,
  (funds, overspent: number, budgeted, budgetedFuture) =>
    funds + overspent + budgeted + budgetedFuture
);

// Budgeting goals
export const goalToBudgetByCategoryForSelectedMonth = createSelector(
  arraySelector(CategoryResource),
  getSelectedMonthBudgetItemByCategoryId,
  getSelectedMonthMoment,
  getAvailableByCategoryIdForSelectedMonth,
  (
    categories: Category[],
    budgetItemsByCategoryId,
    currentMonth,
    availableByCategoryIdForSelectedMonth
  ) => {
    const result = {};

    categories.filter(category => category.goal_type === 'mf').forEach(category => {
      const budgeted = budgetItemsByCategoryId[category.uuid]
        ? budgetItemsByCategoryId[category.uuid].amount
        : 0;
      const toBudget = category.monthly_funding ? category.monthly_funding - budgeted : 0;
      if (toBudget > 0) {
        result[category.uuid] = toBudget;
      }
    });

    categories.filter(category => category.goal_type === 'tbd').forEach(category => {
      // How many month left?
      const monthsLeft = moment(category.target_balance_month).diff(currentMonth, 'months');
      if (monthsLeft > 0) {
        const budgeted = budgetItemsByCategoryId[category.uuid]
          ? budgetItemsByCategoryId[category.uuid].amount
          : 0;

        // How much available ?
        const available = availableByCategoryIdForSelectedMonth.get(category.uuid);

        if (category.target_balance && available !== undefined) {
          const toBudget =
            Math.round((category.target_balance - (available - budgeted)) / monthsLeft) - budgeted;
          if (toBudget > 0) {
            result[category.uuid] = toBudget;
          }
        }
      }
    });

    return result;
  }
);
