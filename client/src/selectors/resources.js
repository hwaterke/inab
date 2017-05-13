import {createSelector} from 'reselect';
import {AccountResource} from 'inab-shared/src/entities/Account';
import {CategoryResource} from 'inab-shared/src/entities/Category';
import {CategoryGroupResource} from 'inab-shared/src/entities/CategoryGroup';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {TransactionResource} from 'inab-shared/src/entities/Transaction';

export const selectAccountsById = state => state.resources[AccountResource.path];
export const selectBudgetItemsById = state => state.resources[BudgetItemResource.path];
export const selectCategoriesById = state => state.resources[CategoryResource.path];
export const selectCategoryGroupsById = state => state.resources[CategoryGroupResource.path];
export const selectTransactionsById = state => state.resources[TransactionResource.path];

export const selectAccounts = createSelector(selectAccountsById, r => Object.values(r));
export const selectBudgetItems = createSelector(selectBudgetItemsById, r => Object.values(r));
export const selectCategories = createSelector(selectCategoriesById, r => Object.values(r));
export const selectCategoryGroups = createSelector(selectCategoryGroupsById, r => Object.values(r));
export const selectTransactions = createSelector(selectTransactionsById, r => Object.values(r));
