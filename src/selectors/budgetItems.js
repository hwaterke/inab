// @flow
import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared/src/crud/selectors/selectors';
import {createInMonthSelectors, createUpToMonthSelectors, sumOfAmounts} from './utils';
import {BudgetItemResource} from '../entities/BudgetItem';

export const inMonth = createInMonthSelectors(arraySelector(BudgetItemResource), bi => bi.month);

export const upToMonth = createUpToMonthSelectors(
  arraySelector(BudgetItemResource),
  bi => bi.month
);

export const getSelectedMonthBudgetItemByCategoryId = createSelector(
  inMonth.selected,
  budgetItems => R.map(R.head)(R.groupBy(R.prop('category_uuid'), budgetItems))
);

export const getBudgetItemsSumUpToPreviousMonth = createSelector(upToMonth.previous, budgetItems =>
  sumOfAmounts(budgetItems)
);
