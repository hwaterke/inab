import AccountForm from './AccountForm';
import Link from './Link';
import Amount from './Amount';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAccounts, getBalanceByAccountId } from '../selectors/accounts';
import { modal } from 'react-redux-modal';
import { selectPage } from '../actions/page';
import FontAwesome from 'react-fontawesome';

class Header extends React.Component {
  static propTypes = {
    selectPage: React.PropTypes.func.isRequired,
    accounts: React.PropTypes.array.isRequired,
    balanceByAccountId: React.PropTypes.instanceOf(Map).isRequired
  };

  createAccountModal() {
    modal.add(AccountForm, {
      size: 'small',
      closeOnOutsideClick: true,
      hideCloseButton: true
    });
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-inab" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <FontAwesome name='bars' fixedWidth />
            </button>
            <Link className="navbar-brand" onClick={() => this.props.selectPage('BUDGET')}>INAB</Link>
          </div>
          <div className="navbar-collapse collapse" id="navbar-inab">
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={() => this.props.selectPage('BUDGET')}>Budget</Link>
              </li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Accounts <span className="caret" /></a>
                <ul className="dropdown-menu">
                  {this.props.accounts.map((account) =>
                  <li key={account.id}>
                    {account.busy && <Link><FontAwesome name='refresh' spin fixedWidth />{account.name}</Link>}
                    {(!account.busy) && <Link onClick={() => this.props.selectPage('ACCOUNT', account.id)}>{account.name}&nbsp;<Amount amount={this.props.balanceByAccountId[account.id]} color /></Link>}
                  </li>
                  )}
                  <li role="separator" className="divider"></li>
                  <li>
                    <Link onClick={::this.createAccountModal}>Add account</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  balanceByAccountId: getBalanceByAccountId(state)
});

const mapDispatchToProps = (dispatch) => ({
  selectPage: bindActionCreators(selectPage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
