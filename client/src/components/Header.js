import AccountFormDialog from './forms/AccountFormDialog';
import Link from './Link';
import Amount from './Amount';
import React from 'react';
import {connect} from 'react-redux';
import {getBudgetBalance, selectBalanceByAccountId} from '../selectors/budget';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';
import {Link as RouterLink} from 'react-router';
import {AccountResource} from '../entities/Account';
import {selectAccounts} from '../selectors/resources';

@ui({
  state: {
    accountFormOpen: false,
    accountSelected: null
  }
})
class Header extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.arrayOf(AccountResource.propType).isRequired,
    balanceByAccountId: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
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

              <RouterLink className="apart dropdown-item" to="/account">
                <span>All&nbsp;</span>
                <Amount amount={this.props.budgetBalance} color />
              </RouterLink>

              {this.props.accounts.map((account) =>
                account.busy ?
                  <Link className="dropdown-item" key={account.uuid}>
                    <FontAwesome name="refresh" spin fixedWidth />
                    {account.name}
                  </Link>
                  :
                  <RouterLink className="apart dropdown-item" key={account.uuid} to={`/account/${account.uuid}`}>
                    <span>{account.name}&nbsp;</span>
                    <Amount amount={this.props.balanceByAccountId[account.uuid]} color />
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
  accounts: selectAccounts(state),
  balanceByAccountId: selectBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state)
});

export default connect(mapStateToProps)(Header);
