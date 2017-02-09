import reduxCrud from 'redux-crud';
import axios from 'axios';
import cuid from 'cuid';
import {addError} from './error.js';

function asyncActionCreatorsFor(resourceName, config) {
  if (resourceName == null) {
    throw new Error('asyncActionCreatorsFor: Expected resourceName');
  }

  config = config || {};
  const standardActionCreators = reduxCrud.actionCreatorsFor(resourceName);
  const baseUrl = config.url || `/api/${resourceName}`;

  return {
    fetch: function () {
      return function (dispatch) {
        dispatch(standardActionCreators.fetchStart());

        // Send the request
        const promise = axios({
          url: baseUrl,
          method: 'GET'
        });

        promise.then(function (response) {
          dispatch(standardActionCreators.fetchSuccess(response.data.data));
        }, function (response) {
          dispatch(standardActionCreators.fetchError(response.data));
          if (response.data.error) {
            dispatch(addError(response.data.error));
          }
        }).catch(function (err) {
          dispatch(addError(err.toString()));
        });

        return promise;
      };
    },

    create: function (resource) {
      return function (dispatch) {
        // Create a client id
        const cid = cuid();
        resource = Object.assign({}, resource, {id: cid});

        dispatch(standardActionCreators.createStart(resource));

        // Send the request
        const promise = axios({
          url: baseUrl,
          method: 'POST',
          data: resource
        });

        promise.then(function (response) {
          dispatch(standardActionCreators.createSuccess(response.data, cid));
        }, function (error) {
          dispatch(standardActionCreators.createError(error.response.data.error, resource));
          if (error.response.data.error) {
            dispatch(addError(error.response.data.error));
          }
        }).catch(function (err) {
          dispatch(addError(err.toString()));
        });

        return promise;
      };
    },

    update: function (resource) {
      return function (dispatch) {
        dispatch(standardActionCreators.updateStart(resource));

        // Send the request
        const promise = axios({
          url: `${baseUrl}/${resource.id}`,
          method: 'PATCH',
          data: resource
        });

        promise.then(function (response) {
          dispatch(standardActionCreators.updateSuccess(response.data));
        }, function (error) {
          dispatch(standardActionCreators.updateError(error.response.data.error, resource));
          if (error.response.data.error) {
            dispatch(addError(error.response.data.error));
          }
        }).catch(function (err) {
          dispatch(addError(err.toString()));
        });

        return promise;
      };
    },

    delete: function (resource) {
      return function (dispatch) {
        dispatch(standardActionCreators.deleteStart(resource));

        // Send the request
        const promise = axios({
          url: `${baseUrl}/${resource.id}`,
          method: 'DELETE'
        });

        promise.then(function (response) {
          dispatch(standardActionCreators.deleteSuccess(response.data));
        }, function (error) {
          dispatch(standardActionCreators.deleteError(error.response.data.error, resource));
          if (error.response.data.error) {
            dispatch(addError(error.response.data.error));
          }
        }).catch(function (err) {
          dispatch(addError(err.toString()));
        });

        return promise;
      };
    }
  };
}

export default asyncActionCreatorsFor;
