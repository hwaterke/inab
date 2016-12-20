import AccountFormDialog from "./forms/AccountFormDialog";
import Link from "./Link";
import Amount from "./Amount";
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAccounts, getBalanceByAccountId} from "../selectors/accounts";
import {getBudgetBalance} from "../selectors/budget";
import {selectPage} from "../actions/page";
import FontAwesome from "react-fontawesome";
import ui from "redux-ui";

@ui({
  state: {
    accountFormOpen: false,
    accountSelected: null
  }
})
class Header extends React.Component {
  static propTypes = {
    selectPage: React.PropTypes.func.isRequired,
    accounts: React.PropTypes.array.isRequired,
    balanceByAccountId: React.PropTypes.instanceOf(Map).isRequired,
    budgetBalance: React.PropTypes.number.isRequired,
    updateUI: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <nav className="navbar navbar-full navbar-dark bg-inverse">

        <Link className="navbar-brand" onClick={() => this.props.selectPage('BUDGET')}>
          INAB
        </Link>

        <ul className="nav navbar-nav">

          <li className="nav-item">
            <Link className="nav-link" onClick={() => this.props.selectPage('BUDGET')}>
              Budget
            </Link>
          </li>

          <li className="nav-item dropdown">

            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="supportedContentDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              Accounts
            </a>

            <div className="dropdown-menu" aria-labelledby="supportedContentDropdown">

              <Link className="dropdown-item" onClick={() => this.props.selectPage("ACCOUNT")}>
                All
                &nbsp;
                <Amount amount={this.props.budgetBalance} color/>
              </Link>

              {this.props.accounts.map((account) =>
                account.busy ?
                  <Link className="dropdown-item" key={account.id}>
                    <FontAwesome name='refresh' spin fixedWidth/>
                    {account.name}
                  </Link>
                  :
                  <Link className="dropdown-item" key={account.id}
                        onClick={() => this.props.selectPage('ACCOUNT', account.id)}>
                    {account.name}
                    &nbsp;
                    <Amount amount={this.props.balanceByAccountId.get(account.id)} color/>
                  </Link>
              )}

              <div role="separator" className="dropdown-divider"/>

              <Link className="dropdown-item"
                    onClick={() => this.props.updateUI({accountFormOpen: true, accountSelected: null})}>
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

const mapDispatchToProps = (dispatch) => ({
  selectPage: bindActionCreators(selectPage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
