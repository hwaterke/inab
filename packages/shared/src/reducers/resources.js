import {reducersForResources} from 'hw-react-shared';
import {AccountResource} from '../entities/Account';
import {CategoryResource} from '../entities/Category';
import {CategoryGroupResource} from '../entities/CategoryGroup';
import {BudgetItemResource} from '../entities/BudgetItem';
import {PayeeResource} from '../entities/Payee';
import {TransactionResource} from '../entities/Transaction';

export const resourcesReducer = reducersForResources([
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  PayeeResource,
  TransactionResource
]);
