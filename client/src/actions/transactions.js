import _ from 'lodash';
import reduxCrud from 'redux-crud';
import axios        from 'axios';

const standardActionCreators = reduxCrud.actionCreatorsFor('transactions');

let actionCreators = {
  fetch() {
    // TODO
  },

  update() {
    // TODO
  },

  add(transaction) {
    return function(dispatch) {
      const action = standardActionCreators.createStart(transaction);
      dispatch(action);

      // Send the request
      const url = '/transactions';
      const promise = axios({
        url: url,
        method: 'POST',
        data: transaction
      });

      promise.then(function(response) {
        // Dispatch the success action
        const action = standardActionCreators.createSuccess(response.data, response.data.cid);
        dispatch(action);
      }, function(error) {
        const action = standardActionCreators.createError(error.data, transaction);
        dispatch(action);
      }).catch(function(err) {
        console.log(err.toString());
      });

      return promise;
    };
  }
};

actionCreators = _.extend(actionCreators, standardActionCreators);
export default actionCreators;
