import {
  AccountResource,
  clearToken,
  getBudgetBalance,
  selectBalanceByAccountId,
  selectIsAdmin,
} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'
import {Link as RouterLink} from 'react-router-dom'
import {select} from 'redux-crud-provider'
import styled from 'styled-components'
import {Amount} from '../Amount'
import Link from '../Link'

const AccountLink = styled(RouterLink).attrs({className: 'dropdown-item'})`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const mapStateToProps = state => ({
  accounts: select(AccountResource).asArray(state),
  balanceByAccountId: selectBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state),
  isAdmin: selectIsAdmin(state),
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
                  <AccountLink to="/account">
                    <span>All&nbsp;</span>
                    <Amount amount={this.props.budgetBalance} hasBackground />
                  </AccountLink>

                  {this.props.accounts.map(
                    account =>
                      account.busy ? (
                        <Link className="dropdown-item" key={account.uuid}>
                          <FontAwesome name="refresh" spin fixedWidth />
                          {account.name}
                        </Link>
                      ) : (
                        <AccountLink
                          key={account.uuid}
                          to={`/account/${account.uuid}`}
                        >
                          <span>{account.name}&nbsp;</span>
                          <Amount
                            amount={this.props.balanceByAccountId[account.uuid]}
                            hasBackground
                          />
                        </AccountLink>
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
              data-testid="logout"
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
