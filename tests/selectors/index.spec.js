import {createStore, combineReducers} from 'redux';
import {resourcesReducer} from '../../src/reducers/resources';
import {categoryGroupsSelectorTests} from './categoryGroups';
import {categoriesSelectorTests} from './categories';
import {monthSelectorTests} from './month';
import {selectedMonthReducer} from '../../src/reducers/month';
import {budgetItemsSelectorTests} from './budgetItems';
import {transactionsSelectorTests} from './transactions';
import {budgetSelectorTests} from './budget';

describe('Selectors', () => {
  let store;

  function getStore() {
    return store;
  }

  beforeEach(() => {
    const reducer = combineReducers({
      resources: resourcesReducer,
      selectedMonth: selectedMonthReducer
    });
    store = createStore(reducer);
  });

  afterEach(() => {
    //console.log('State', JSON.stringify(store.getState(), null, 2));
  });

  categoryGroupsSelectorTests(getStore);
  categoriesSelectorTests(getStore);
  monthSelectorTests(getStore);
  budgetItemsSelectorTests(getStore);
  transactionsSelectorTests(getStore);
  budgetSelectorTests(getStore);
});
