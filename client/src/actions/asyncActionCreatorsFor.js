import reduxCrud from 'redux-crud';
import * as constants from 'redux-crud';
import axios from 'axios';
import cuid from 'cuid';

// TODO add delete methods.

function asyncActionCreatorsFor(resourceName, config) {
  if (resourceName == null) throw new Error('asyncActionCreatorsFor: Expected resourceName');

  config = config || {};
  const standardActionCreators = reduxCrud.actionCreatorsFor(resourceName);
  const key = config.key || constants.DEFAULT_KEY;
  const baseUrl = config.url || `/${resourceName}`;

  return {
    fetch: function() {
      return function(dispatch) {
        dispatch(standardActionCreators.fetchStart());

        // Send the request
        const promise = axios({
          url: baseUrl,
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

    create: function(resource) {
      return function(dispatch) {
        // Create a client id
        var cid = cuid();
        resource = Object.assign({}, resource, {[key]: cid});

        dispatch(standardActionCreators.createStart(resource));

        // Send the request
        const promise = axios({
          url: baseUrl,
          method: 'POST',
          data: resource
        });

        promise.then(function(response) {
          dispatch(standardActionCreators.createSuccess(response.data, cid));
        }, function(error) {
          dispatch(standardActionCreators.createError(error.data, resource));
        }).catch(function(err) {
          console.log(err.toString());
        });

        return promise;
      };
    },

    update: function(resource) {
      return function(dispatch) {
        dispatch(standardActionCreators.updateStart(resource));

        // Send the request
        const promise = axios({
          url: `${baseUrl}/${resource[key]}`,
          method: 'PATCH',
          data: resource
        });

        promise.then(function(response) {
          dispatch(standardActionCreators.updateSuccess(response.data));
        }, function(error) {
          dispatch(standardActionCreators.updateError(error.data, resource));
        }).catch(function(err) {
          console.log(err.toString());
        });

        return promise;
      };
    }
  };
}

export default asyncActionCreatorsFor;
