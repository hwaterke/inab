import {
  AccountResource,
  clearToken,
  getBudgetBalance,
  selectBalanceByAccountId,
  selectIsAdmin,
} from '@inab/shared'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {select} from 'redux-crud-provider'
import styled from 'styled-components'
import {Amount} from '../Amount'

const AccountLink = styled(Link).attrs({className: 'navbar-item'})`
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
export class NavBar extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
    balanceByAccountId: PropTypes.objectOf(PropTypes.number).isRequired,
    budgetBalance: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    clearToken: PropTypes.func.isRequired,
  }

  state = {
    isOpen: false,
  }

  toggle = () => {
    this.setState(({isOpen}) => ({isOpen: !isOpen}))
  }

  logout = () => {
    this.props.clearToken()
  }

  render() {
    return (
      <nav className="navbar" aria-label="main navigation">
        <div className="container is-fluid">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              INAB
            </Link>

            <a
              role="button"
              className={classNames('navbar-burger', {
                'is-active': this.state.isOpen,
              })}
              aria-label="menu"
              aria-expanded="false"
              onClick={this.toggle}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>

          <div
            className={classNames('navbar-menu', {
              'is-active': this.state.isOpen,
            })}
          >
            <div className="navbar-start">
              <Link className="navbar-item" to="/">
                Budget
              </Link>

              <Link className="navbar-item" to="/payees">
                Payees
              </Link>

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Accounts</a>

                <div className="navbar-dropdown">
                  <AccountLink to="/account">
                    <span>All&nbsp;</span>
                    <Amount amount={this.props.budgetBalance} hasBackground />
                  </AccountLink>

                  {this.props.accounts.map(
                    account =>
                      account.busy ? (
                        <a className="dropdown-item" key={account.uuid}>
                          <FontAwesome name="refresh" spin fixedWidth />
                          {account.name}
                        </a>
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

                  <hr className="navbar-divider" />

                  <Link className="navbar-item" to="/accounts">
                    Manage accounts
                  </Link>
                </div>
              </div>

              {this.props.isAdmin && (
                <Link className="navbar-item" to="/admin">
                  Admin
                </Link>
              )}
            </div>

            <div className="navbar-end">
              <a
                role="button"
                className="navbar-item"
                data-testid="logout"
                onClick={this.logout}
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
