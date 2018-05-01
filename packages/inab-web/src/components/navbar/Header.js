import React from 'react'
import PropTypes from 'prop-types'
import Link from '../Link'
import {Amount} from '../Amount'
import {connect} from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {Link as RouterLink} from 'react-router-dom'
import {
  AccountResource,
  selectBalanceByAccountId,
  getBudgetBalance,
} from 'inab-shared'
import {select} from 'redux-crud-provider'
import {clearToken} from '../../reducers/credentials'

const mapStateToProps = state => ({
  accounts: select(AccountResource).asArray(state),
  balanceByAccountId: selectBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state),
  isAdmin: state.credentials.is_admin,
})

@connect(mapStateToProps, {clearToken})
export class Header extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
    balanceByAccountId: PropTypes.objectOf(PropTypes.number).isRequired,
    budgetBalance: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    clearToken: PropTypes.func.isRequired,
  }

  logout = () => {
    this.props.clearToken()
  }

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
                <RouterLink className="nav-link" to="/">
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

                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <RouterLink className="apart dropdown-item" to="/account">
                    <span>All&nbsp;</span>
                    <Amount amount={this.props.budgetBalance} hasBackground />
                  </RouterLink>

                  {this.props.accounts.map(
                    account =>
                      account.busy ? (
                        <Link className="dropdown-item" key={account.uuid}>
                          <FontAwesome name="refresh" spin fixedWidth />
                          {account.name}
                        </Link>
                      ) : (
                        <RouterLink
                          className="apart dropdown-item"
                          key={account.uuid}
                          to={`/account/${account.uuid}`}
                        >
                          <span>{account.name}&nbsp;</span>
                          <Amount
                            amount={this.props.balanceByAccountId[account.uuid]}
                            hasBackground
                          />
                        </RouterLink>
                      )
                  )}

                  <div role="separator" className="dropdown-divider" />

                  <RouterLink className="dropdown-item" to="/accounts">
                    Manage accounts
                  </RouterLink>
                </div>
              </li>

              {this.props.isAdmin && (
                <li className="nav-item">
                  <RouterLink className="nav-link" to="/admin">
                    Admin
                  </RouterLink>
                </li>
              )}
            </ul>
          </div>

          <form className="form-inline">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.logout}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    )
  }
}
