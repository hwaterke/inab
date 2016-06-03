import _ from 'lodash';
import reduxCrud from 'redux-crud';
import axios        from 'axios';

const standardActionCreators = reduxCrud.actionCreatorsFor('transactions');

let actionCreators = {
  fetch() {
    return function(dispatch) {
      dispatch(standardActionCreators.fetchStart());

      // Send the request
      const url = '/transactions';
      const promise = axios({
        url: url,
        method: 'GET'
      });

      promise.then(function(response) {
        dispatch(standardActionCreators.fetchSuccess(response.data));
      }, function(response) {
        dispatch(standardActionCreators.fetchError(response.data));
      }).catch(function(error) {
        console.error(error.toString());
      });

      return promise;
    };
  },

  update() {
    // TODO
  },

  add(transaction) {
    return function(dispatch) {
      dispatch(standardActionCreators.createStart(transaction));

      // Send the request
      const url = '/transactions';
      const promise = axios({
        url: url,
        method: 'POST',
        data: transaction
      });

      promise.then(function(response) {
        dispatch(standardActionCreators.createSuccess(response.data, response.data.cid));
      }, function(error) {
        dispatch(standardActionCreators.createError(error.data, transaction));
      }).catch(function(err) {
        console.log(err.toString());
      });

      return promise;
    };
  }
};

actionCreators = _.extend(actionCreators, standardActionCreators);
export default actionCreators;
