import {createSelector} from 'reselect';
import {createInMonthSelectors, createUpToMonthSelectors} from './ui';
import {createMappingSelector, sumOfAmounts} from './utils';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {arraySelector} from 'hw-react-shared/src/crud/selectors/selectors';

// Filters
export const inMonth = createInMonthSelectors(arraySelector(BudgetItemResource), bi => bi.month);
export const upToMonth = createUpToMonthSelectors(
  arraySelector(BudgetItemResource),
  bi => bi.month
);

// Grouping
export const getSelectedMonthBudgetItemsByCategoryId = createMappingSelector(
  inMonth.current,
  'category_uuid'
);

// Sums
export const getBudgetItemsSumUpToPreviousMonth = createSelector(upToMonth.previous, budgetItems =>
  sumOfAmounts(budgetItems)
);
