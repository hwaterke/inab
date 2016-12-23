import React from "react";
import TransactionContainer from "./TransactionContainer";
import {connect} from "react-redux";
import {getSortedTransactions} from "../selectors/transactions";
import {getSelectedAccount} from "../selectors/ui";
import {getBalanceByAccountId} from "../selectors/accounts";
import {getBudgetBalance} from "../selectors/budget";
import AccountHeader from "./AccountHeader";

const AccountPage = ({title, balance, transactions}) => (
  <div>
    <AccountHeader name={title} balance={balance}/>
    <div className="col-md-12">
      <TransactionContainer transactions={transactions}/>
    </div>
  </div>
);

AccountPage.propTypes = {
  title: React.PropTypes.string.isRequired,
  transactions: React.PropTypes.array.isRequired,
  balance: React.PropTypes.number
};

const mapStateToProps = (state) => {
  let title = "All";
  let transactions = getSortedTransactions(state);
  let balance = getBudgetBalance(state);

  const aid = getSelectedAccount(state);

  if (aid) {
    // Check if the account exist.
    const account = state.accounts.find((a) => a.id == aid);
    if (account) {
      title = account.name;
      transactions = transactions.filter((t) => t.account_id == aid || t.transfer_account_id == aid);
      balance = getBalanceByAccountId(state).get(aid);
    }
  }

  return {
    title,
    transactions,
    balance
  };
};

export default connect(mapStateToProps)(AccountPage);
