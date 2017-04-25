// @flow
import {Component, PropTypes, createElement} from 'react';
import {connect} from 'react-redux';
import reduxCrud from 'redux-crud';
import axios from 'axios';
import cuid from 'cuid';
import {clearToken} from '../reducers/credentials';
import {addError} from '../actions/error';

/**
 * HOC to provide CRUD functionality to a component.
 * It handles requests to the backend
 */
export function crud() {

  return function (WrappedComponent: ReactClass<{}>): ReactClass<{}> {

    class Crud extends Component {

      static propTypes = {
        credentials: PropTypes.shape({
          backend: PropTypes.string.isRequired,
          token: PropTypes.string.isRequired
        }).isRequired,
        dispatch: PropTypes.func.isRequired
      };

      isAuthenticated = () => !!this.props.credentials.token;

      fetchAll = (resourceName: string) => {
        const baseActionCreators = this.initBaseActionCreators(resourceName);
        this.props.dispatch(baseActionCreators.fetchStart());

        const promise = axios({
          url: `${this.props.credentials.backend}/${resourceName}`,
          method: 'get',
          headers: {'Authorization': this.props.credentials.token}
        });

        promise.then(response => {
          this.props.dispatch(baseActionCreators.fetchSuccess(response.data.data));
        }, error => {
          this.props.dispatch(baseActionCreators.fetchError(error.response.data.error));
          this.clearTokenOnAuthError(error.response.status);
          this.props.dispatch(addError(`Fetch error. ${error.response.data.error}`));
        }).catch(err => {
          this.props.dispatch(addError(`Fetch catch error. ${err}`));
        });

        return promise;
      };

      createResource = (resourceName: string, resource) => {
        // Create a client id
        const cid = cuid();
        resource = Object.assign({}, resource, {uuid: cid});

        const baseActionCreators = this.initBaseActionCreators(resourceName);
        this.props.dispatch(baseActionCreators.createStart(resource));

        const promise = axios({
          url: `${this.props.credentials.backend}/${resourceName}`,
          method: 'post',
          headers: {'Authorization': this.props.credentials.token},
          data: resource
        });

        promise.then(response => {
          this.props.dispatch(baseActionCreators.createSuccess(response.data, cid));
        }, error => {
          this.props.dispatch(baseActionCreators.createError(error.response.data.error, resource));
          this.clearTokenOnAuthError(error.response.status);
          this.props.dispatch(addError(`Create error. ${error.response.data.error}`));
        }).catch(err => {
          this.props.dispatch(addError(`Create catch error. ${err}`));
        });

        return promise;
      };

      updateResource = (resourceName: string, resource) => {
        const baseActionCreators = this.initBaseActionCreators(resourceName);
        this.props.dispatch(baseActionCreators.updateStart(resource));

        const promise = axios({
          url: `${this.props.credentials.backend}/${resourceName}/${resource.uuid}`,
          method: 'patch',
          headers: {'Authorization': this.props.credentials.token},
          data: resource
        });

        promise.then(response => {
          this.props.dispatch(baseActionCreators.updateSuccess(response.data));
        }, error => {
          this.props.dispatch(baseActionCreators.updateError(error.response.data.error));
          this.clearTokenOnAuthError(error.response.status);
          this.props.dispatch(addError(`Update error. ${error.response.data.error}`));
        }).catch(err => {
          this.props.dispatch(addError(`Update catch error. ${err}`));
        });

        return promise;
      };

      deleteResource = (resourceName: string, resource) => {
        const baseActionCreators = this.initBaseActionCreators(resourceName);
        this.props.dispatch(baseActionCreators.deleteStart(resource));

        const promise = axios({
          url: `${this.props.credentials.backend}/${resourceName}/${resource.uuid}`,
          method: 'delete',
          headers: {'Authorization': this.props.credentials.token}
        });

        promise.then(() => {
          this.props.dispatch(baseActionCreators.deleteSuccess(resource));
        }, error => {
          this.props.dispatch(baseActionCreators.deleteError(error.response.data.error));
          this.clearTokenOnAuthError(error.response.status);
          this.props.dispatch(addError(`Delete error. ${error.response.data.error}`));
        }).catch(err => {
          this.props.dispatch(addError(`Delete catch error. ${err}`));
        });

        return promise;
      };

      // Makes sure props are ok and returns the base action creators
      initBaseActionCreators(resourceName: string) {
        if (resourceName == null) {
          throw new Error('Crud: Expected resourceName');
        }

        if (!this.isAuthenticated()) {
          throw new Error('Crud: Not authenticated');
        }

        return reduxCrud.actionCreatorsFor(resourceName, {key: 'uuid'});
      }

      // Private method to clear the token if the backend says it is not valid.
      clearTokenOnAuthError(status: number) {
        if (status === 401) {
          this.props.dispatch(clearToken());
        }
      }

      render() {
        return createElement(WrappedComponent, {
          fetchAll: this.fetchAll,
          createResource: this.createResource,
          updateResource: this.updateResource,
          deleteResource: this.deleteResource,
          isAuthenticated: this.isAuthenticated,
          ...this.props
        });
      }
    }

    // Extract the name of the WrappedReduxFormComponent
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    // Name the WrapperComponent accordingly
    Crud.displayName = `Crud(${wrappedComponentName})`;

    const mapStateToProps = (state) => ({
      credentials: state.credentials,
    });

    return connect(mapStateToProps)(Crud);

  };

}
