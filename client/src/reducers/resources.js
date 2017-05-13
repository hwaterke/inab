import {reducersForResources} from 'hw-react-shared/src/crud/reducers/reducersForResources';
import {AccountResource} from 'inab-shared/src/entities/Account';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {CategoryResource} from 'inab-shared/src/entities/Category';
import {CategoryGroupResource} from 'inab-shared/src/entities/CategoryGroup';
import {TransactionResource} from 'inab-shared/src/entities/Transaction';

export const resourcesReducer = reducersForResources([
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  TransactionResource
]);
