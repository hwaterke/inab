import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import * as Table from 'reactabular-table'
import styled from 'styled-components'
import {Amount} from './Amount'

const Tags = styled.div`
  display: flex;

  span {
    font-size: 0.8rem;
    background-color: #96daf7;
    color: #1f6380;
    border: 1px solid #74b8d5;
    border-radius: 2px;
    margin-right: 2px;
    padding: 2px 4px;
  }
`

const Error = styled.div`
  padding-left: 1rem;
  background-color: tomato;
`

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
                  <Error>
                    <FontAwesome name="exclamation-triangle" /> No category
                  </Error>
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
              <Tags>{tags.map(t => <span key={t.name}>{t.name}</span>)}</Tags>
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
                  <a onClick={() => this.props.onPencilClick(e.rowData.uuid)}>
                    <FontAwesome name="pencil" />
                  </a>
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
                  <a
                    onClick={() => {
                      this.props.onClearClick(e.rowData.uuid)
                    }}
                  >
                    <FontAwesome
                      title={e.rowData.cleared_at ? 'Unclear' : 'Clear'}
                      name={
                        e.rowData.cleared_at ? 'check-circle-o' : 'circle-o'
                      }
                    />
                  </a>
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
        className="table is-narrow is-fullwidth"
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
