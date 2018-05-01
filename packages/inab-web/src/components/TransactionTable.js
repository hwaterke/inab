import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import * as Table from 'reactabular-table'
import {Amount} from './Amount'
import Link from './Link'
import './TransactionTable.scss'

class TransactionTable extends React.Component {
  static propTypes = {
    transactions: PropTypes.array.isRequired,
    selectedRows: PropTypes.instanceOf(Immutable.Set),
    onSelectRow: PropTypes.func,
    onPencilClick: PropTypes.func.isRequired,
    onClearClick: PropTypes.func.isRequired,
    hiddenColumns: PropTypes.object.isRequired,
  }

  onRow = row => {
    if (row.subtransaction) {
      return {
        className: row.selected ? 'table-active' : null,
        onClick: () => this.props.onSelectRow(row.parent_transaction),
      }
    }
    return {
      className: row.selected ? 'table-active' : null,
      onClick: () => this.props.onSelectRow(row.uuid),
    }
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
                  return <FontAwesome name="check-circle-o" />
                }
                return <FontAwesome name="circle-o" />
              }
            },
          ],
        },
      },
      {
        property: 'account',
        header: {
          label: 'Account',
        },
      },
      {
        property: 'display_date',
        header: {
          label: 'Date',
        },
      },
      {
        property: 'time',
        header: {
          label: 'Time',
        },
      },
      {
        property: 'payee',
        header: {
          label: 'Payee',
        },
        cell: {
          formatters: [
            (payee, extra) => {
              if (extra.rowData.is_transfer) {
                return (
                  <div>
                    <FontAwesome name="exchange" /> {payee}
                  </div>
                )
              }
              return payee
            },
          ],
        },
      },
      {
        property: 'category',
        header: {
          label: 'Category',
        },
        cell: {
          formatters: [
            (category, extra) => {
              if (!category && !extra.rowData.is_transfer) {
                return (
                  <div className="no-category">
                    <FontAwesome name="exclamation-triangle" /> No category
                  </div>
                )
              }
              return category
            },
          ],
        },
      },
      {
        property: 'description',
        header: {
          label: 'Description',
        },
      },
      {
        property: 'tags',
        header: {
          label: 'Tags',
        },
        cell: {
          formatters: [
            tags => (
              <div className="table-tags">
                {tags.map(t => <span key={t.name}>{t.name}</span>)}
              </div>
            ),
          ],
        },
      },
      {
        property: 'amount',
        header: {
          label: 'Amount',
        },
        props: {
          style: {
            textAlign: 'right',
          },
        },
        cell: {
          formatters: [amount => <Amount amount={amount} hasBackground />],
        },
      },
      {
        props: {
          style: {
            textAlign: 'center',
          },
        },
        cell: {
          formatters: [
            (a, e) => {
              if (!e.rowData.subtransaction) {
                return (
                  <Link
                    onClick={event => {
                      event.stopPropagation()
                      this.props.onPencilClick(e.rowData.uuid)
                    }}
                  >
                    <FontAwesome name="pencil" />
                  </Link>
                )
              }
              return null
            },
          ],
        },
      },
      {
        props: {
          style: {
            textAlign: 'center',
          },
        },
        cell: {
          formatters: [
            (a, e) => {
              if (!e.rowData.subtransaction) {
                return (
                  <Link
                    onClick={event => {
                      event.stopPropagation()
                      this.props.onClearClick(e.rowData.uuid)
                    }}
                  >
                    <FontAwesome
                      title={e.rowData.cleared_at ? 'Unclear' : 'Clear'}
                      name={
                        e.rowData.cleared_at ? 'check-circle-o' : 'circle-o'
                      }
                    />
                  </Link>
                )
              }
              return null
            },
          ],
        },
      },
    ]

    return columns.filter(c => !this.props.hiddenColumns[c.property])
  }

  render() {
    const selectedTransactions = this.props.transactions.map(tr => ({
      ...tr,
      selected: tr.subtransaction
        ? this.props.selectedRows.has(tr.parent_transaction)
        : this.props.selectedRows.has(tr.uuid),
    }))

    return (
      <Table.Provider
        className="table table-sm table-hover transaction-table"
        columns={this.getColumns()}
      >
        <Table.Header />
        <Table.Body
          rows={selectedTransactions}
          onRow={this.onRow}
          rowKey="key"
        />
      </Table.Provider>
    )
  }
}

export default TransactionTable
