import {combineReducers} from "redux";
import transactionsReducers from "./transactions";
import accountsReducers from "./accounts";
import categoriesReducers from "./categories";
import categoryGroupsReducers from "./categoryGroups";
import budgetItemsReducers from "./budgetItems";
import errorsReducer from "./errors";
import {reducer as formReducer} from "redux-form";
import {reducer as uiReducer} from "redux-ui";
import {routerReducer} from "react-router-redux";

function selectedAccountReducer(state = null, action) {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE": {
      let result = action.payload.pathname.match(/^\/account\/(\d+)/i);
      if (result) {
        return Number.parseInt(result[1]);
      }
      return null;
    }
  }
  return state;
}

export default combineReducers({
  selectedAccount: selectedAccountReducer,
  transactions: transactionsReducers,
  accounts: accountsReducers,
  categories: categoriesReducers,
  categoryGroups: categoryGroupsReducers,
  budgetItems: budgetItemsReducers,
  form: formReducer,
  ui: uiReducer,
  routing: routerReducer,
  errors: errorsReducer
});
