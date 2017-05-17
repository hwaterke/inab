import {createStore, combineReducers} from 'redux';
import {resourcesReducer} from '../../src/reducers/resources';
import {categoryGroupsSelectorTests} from './categoryGroups';
import {categoriesSelectorTests} from './categories';

describe('Selectors', () => {
  let store;

  function getStore() {
    return store;
  }

  beforeEach(() => {
    const reducer = combineReducers({resources: resourcesReducer});
    store = createStore(reducer);
  });

  afterEach(() => {
    console.log('State', JSON.stringify(store.getState(), null, 2));
  });

  categoryGroupsSelectorTests(getStore);
  categoriesSelectorTests(getStore);
});
