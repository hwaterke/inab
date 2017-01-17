import React from 'react';
import * as Table from 'reactabular-table';
import Amount from './Amount';
import FontAwesome from 'react-fontawesome';
import * as Immutable from 'immutable';
import Link from './Link';
import './TransactionTable.scss';

class TransactionTable extends React.Component {
  constructor(props) {
    super(props);
    this.onRow = this.onRow.bind(this);
  }

  static propTypes = {
    transactions: React.PropTypes.array.isRequired,
    selectedRows: React.PropTypes.instanceOf(Immutable.Set),
    onSelectRow: React.PropTypes.func,
    onPencilClick: React.PropTypes.func.isRequired,
    hiddenColumns: React.PropTypes.object.isRequired
  };

  onRow(row) {
    if (row.subtransaction) {
      return {
        className: row.selected && 'table-active',
        onClick: () => this.props.onSelectRow(row.parent_transaction)
      };
    }
    return {
      className: row.selected && 'table-active',
      onClick: () => this.props.onSelectRow(row.id)
    };
  }

  getColumns() {
    const columns = [
      {
        property: 'selected',
        cell: {
          formatters: [
            (selected, extra) => {
              if (!extra.rowData.subtransaction) {
                if (selected) {
                  return <FontAwesome name='check-circle-o'/>;
                }
                return <FontAwesome name='circle-o'/>;
              }
            }
          ]
        }
      },
      {
        property: 'account',
        header: {
          label: 'Account'
        },
      },
      {
        property: 'display_date',
        header: {
          label: 'Date'
        },
      },
      {
        property: 'payee',
        header: {
          label: 'Payee'
        },
        cell: {
          formatters: [
            (payee, extra) => {
              if (extra.rowData.is_transfer) {
                return <div><FontAwesome name='exchange'/> {payee}</div>;
              }
              return payee;
            }
          ]
        }
      },
      {
        property: 'category',
        header: {
          label: 'Category'
        }
      },
      {
        property: 'description',
        header: {
          label: 'Description'
        }
      },
      {
        property: 'amount',
        header: {
          label: 'Amount'
        },
        props: {
          style: {
            textAlign: 'right'
          }
        },
        cell: {
          formatters: [
            (amount) => (
              <Amount amount={amount} color/>
            )
          ]
        }
      },
      {
        cell: {
          formatters: [
            (a, e) => {
              if (!e.rowData.subtransaction) {
                return (
                  <Link onClick={() => this.props.onPencilClick(e.rowData.id)}><FontAwesome name='pencil'/></Link>);
              }
              return null;
            }
          ]
        }
      },
    ];

    return columns.filter(c => !this.props.hiddenColumns[c.property]);
  }

  render() {
    const selectedTransactions = this.props.transactions.map(tr => ({
      ...tr,
      selected: tr.subtransaction ?
        this.props.selectedRows.has(tr.parent_transaction) :
        this.props.selectedRows.has(tr.id)
    }));

    return (
      <Table.Provider
        className="table table-sm table-hover transaction-table"
        columns={this.getColumns()}
      >
        <Table.Header/>
        <Table.Body
          rows={selectedTransactions}
          onRow={this.onRow}
          rowKey="id"
        />
      </Table.Provider>
    );
  }
}

export default TransactionTable;
