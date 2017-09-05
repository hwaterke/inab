import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import Amount from '../Amount';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {Link as RouterLink} from 'react-router-dom';
import {AccountResource, selectBalanceByAccountId, getBudgetBalance} from 'inab-shared';
import {arraySelector} from 'hw-react-shared';

const mapStateToProps = state => ({
  accounts: arraySelector(AccountResource)(state),
  balanceByAccountId: selectBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state)
});

@connect(mapStateToProps)
export class Header extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propType).isRequired,
    balanceByAccountId: PropTypes.objectOf(PropTypes.number).isRequired,
    budgetBalance: PropTypes.number.isRequired
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <RouterLink className="navbar-brand" to="/">
            INAB
          </RouterLink>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <RouterLink className="nav-link" to="/budget">
                  Budget
                </RouterLink>
              </li>

              <li className="nav-item">
                <RouterLink className="nav-link" to="/payees">
                  Payees
                </RouterLink>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup
                  aria-expanded="false"
                >
                  Accounts
                </a>

                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <RouterLink className="apart dropdown-item" to="/account">
                    <span>All&nbsp;</span>
                    <Amount amount={this.props.budgetBalance} color />
                  </RouterLink>

                  {this.props.accounts.map(
                    account =>
                      account.busy
                        ? <Link className="dropdown-item" key={account.uuid}>
                            <FontAwesome name="refresh" spin fixedWidth />
                            {account.name}
                          </Link>
                        : <RouterLink
                            className="apart dropdown-item"
                            key={account.uuid}
                            to={`/account/${account.uuid}`}
                          >
                            <span>
                              {account.name}&nbsp;
                            </span>
                            <Amount amount={this.props.balanceByAccountId[account.uuid]} color />
                          </RouterLink>
                  )}

                  <div role="separator" className="dropdown-divider" />

                  <RouterLink className="dropdown-item" to="/accounts">
                    Manage accounts
                  </RouterLink>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
