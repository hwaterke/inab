import AccountFormDialog from './forms/AccountFormDialog';
import Link from './Link';
import Amount from './Amount';
import React from 'react';
import {connect} from 'react-redux';
import {getAccounts, getBalanceByAccountId} from '../selectors/accounts';
import {getBudgetBalance} from '../selectors/budget';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';
import {Link as RouterLink} from 'react-router';
import {AccountResource} from '../entities/Account';

@ui({
  state: {
    accountFormOpen: false,
    accountSelected: null
  }
})
class Header extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.arrayOf(AccountResource.propType).isRequired,
    balanceByAccountId: React.PropTypes.instanceOf(Map).isRequired,
    budgetBalance: React.PropTypes.number.isRequired,
    updateUI: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <nav className="navbar navbar-full navbar-dark bg-inverse">

        <RouterLink className="navbar-brand" to="/">
          INAB
        </RouterLink>

        <ul className="nav navbar-nav">

          <li className="nav-item">
            <RouterLink className="nav-link" to="/budget">
              Budget
            </RouterLink>
          </li>

          <li className="nav-item dropdown">

            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="supportedContentDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Accounts
            </a>

            <div className="dropdown-menu" aria-labelledby="supportedContentDropdown">

              <RouterLink className="dropdown-item" to="/account">
                All
                &nbsp;
                <Amount amount={this.props.budgetBalance} color />
              </RouterLink>

              {this.props.accounts.map((account) =>
                account.busy ?
                  <Link className="dropdown-item" key={account.id}>
                    <FontAwesome name="refresh" spin fixedWidth />
                    {account.name}
                  </Link>
                  :
                  <RouterLink className="dropdown-item" key={account.id} to={`/account/${account.id}`}>
                    {account.name}
                    &nbsp;
                    <Amount amount={this.props.balanceByAccountId.get(account.id)} color />
                  </RouterLink>
              )}

              <div role="separator" className="dropdown-divider" />

              <Link
                className="dropdown-item"
                onClick={() => this.props.updateUI({accountFormOpen: true, accountSelected: null})}
              >
                Add account
              </Link>
              <AccountFormDialog />
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  balanceByAccountId: getBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state)
});

export default connect(mapStateToProps)(Header);
