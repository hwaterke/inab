import React from "react";
import asyncActionCreatorsFor from "../actions/asyncActionCreatorsFor";
import ui from "redux-ui";
import {connect} from "react-redux";
import {getTransactionsById} from "../selectors/transactions";
import {getSelectedAccount} from "../selectors/ui";
import Immutable from "immutable";
import ButtonIcon from "./ButtonIcon";
import ButtonDelete from "./ButtonDelete";
import "./TransactionToolbar.scss";

const mapStateToProps = (state) => {
  return {
    transactionsById: getTransactionsById(state),
    accountSelected: !!getSelectedAccount(state)
  };
};

@ui()
@connect(mapStateToProps, asyncActionCreatorsFor('transactions'))
export default class TransactionToolbar extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    transactionsById: React.PropTypes.instanceOf(Map).isRequired,
    accountSelected: React.PropTypes.bool.isRequired,
    delete: React.PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.deleteTransactions = this.deleteTransactions.bind(this);
  }

  deleteTransactions() {
    const records = this.props.ui.selectedTransactions.map((id) => this.props.transactionsById.get(id));
    this.props.updateUI('selectedTransactions', Immutable.Set());
    records.forEach((r) => this.props.delete(r));
  }

  render() {
    return (
      <div className="btn-group transaction-toolbar">

        <ButtonIcon
          className="btn btn-success"
          onClick={() => this.props.updateUI({showAccount: !this.props.ui.showAccount})}
          icon="bank"
        />

        {
          this.props.accountSelected &&
          <ButtonIcon
            className="btn btn-info"
            onClick={() => this.props.updateUI({addingTransaction: true, editingTransactionId: null})}
            icon="plus"
          >
            New
          </ButtonIcon>
        }

        {
          this.props.ui.selectedTransactions.size > 0 &&
          <ButtonIcon
            className="btn btn-warning"
            onClick={() => this.props.updateUI('selectedTransactions', Immutable.Set())}
            icon="ban"
          >
            Deselect ({this.props.ui.selectedTransactions.size})
          </ButtonIcon>
        }

        {
          this.props.ui.selectedTransactions.size > 0 &&
          <ButtonDelete onClick={this.deleteTransactions}>
            Delete ({this.props.ui.selectedTransactions.size})
          </ButtonDelete>
        }
      </div>
    );
  }
}
