import {combineReducers, createStore} from 'redux'
import {resourcesActivityReducer} from '../../src'
import {selectedMonthReducer} from '../../src/reducers/month'
import {resourcesReducer} from '../../src/reducers/resources'
import {budgetSelectorTests} from './budget'
import {budgetItemsSelectorTests} from './budgetItems'
import {budgetUseCaseTests} from './budgetUseCase'
import {categoriesSelectorTests} from './categories'
import {categoryGroupsSelectorTests} from './categoryGroups'
import {monthSelectorTests} from './month'
import {transactionsSelectorTests} from './transactions'

describe('Selectors', () => {
  let store

  function getStore() {
    return store
  }

  beforeEach(() => {
    const reducer = combineReducers({
      resources: resourcesReducer,
      resourcesActivity: resourcesActivityReducer,
      selectedMonth: selectedMonthReducer,
    })
    store = createStore(reducer)
  })

  afterEach(() => {
    //console.log('State', JSON.stringify(store.getState(), null, 2));
  })

  categoryGroupsSelectorTests(getStore)
  categoriesSelectorTests(getStore)
  monthSelectorTests(getStore)
  budgetItemsSelectorTests(getStore)
  transactionsSelectorTests(getStore)
  budgetSelectorTests(getStore)
  budgetUseCaseTests(getStore)
})
