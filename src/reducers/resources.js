import {reducersForResources} from 'hw-react-shared/src/crud/reducers/reducersForResources';
import {AccountResource} from '../entities/Account';
import {CategoryResource} from '../entities/Category';
import {CategoryGroupResource} from '../entities/CategoryGroup';
import {BudgetItemResource} from '../entities/BudgetItem';
import {TransactionResource} from '../entities/Transaction';

export const resourcesReducer = reducersForResources([
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  TransactionResource
]);
