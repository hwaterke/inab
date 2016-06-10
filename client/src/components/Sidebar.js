import React from 'react';
import Link from './Link';
import Button from './Button';
import * as actions from '../actions/page';
import { connect } from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import {modal} from 'react-redux-modal';
import AccountForm from './AccountForm';
import { getAccounts } from '../reducers/accounts';

class Sidebar extends React.Component {
  componentDidMount() {
    if (this.props.accounts.length == 0) {
      this.props.fetch();
    }
  }

  addModal() {
    modal.add(AccountForm, {
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: true,
      hideCloseButton: true
    });
  }

  render() {
    return (
      <ul className="nav sidebar-nav">
        <li><Link children="Budget" onClick={() => this.props.selectPage('BUDGET')} /></li>
        {this.props.accounts.map((account) =>
          <li key={account.id}>
            <Link children={account.name} onClick={() => this.props.selectPage('ACCOUNT', account.id)} />
          </li>
        )}
        <li><Button children="Add account" onClick={::this.addModal} /></li>
      </ul>
    );
  }
}

Sidebar.propTypes = {
  selectPage: React.PropTypes.func.isRequired,
  accounts: React.PropTypes.array.isRequired,
  fetch: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({accounts: getAccounts(state)});
export default connect(mapStateToProps, Object.assign({}, actions, asyncActionCreatorsFor('accounts')))(Sidebar);
