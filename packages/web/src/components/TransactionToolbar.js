import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import ui from 'redux-ui'
import styled from 'styled-components'
import Button from './Button'
import ButtonDelete from './ButtonDelete'
import ButtonIcon from './ButtonIcon'

export const TransactionToolbarRow = styled.div`
  margin: 0.5rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;

  @media (min-width: 768px) {
    > div {
      flex: 1;
    }
  }
`

@ui({
  state: {
    filtersVisible: false,
  },
})
class TransactionToolbar extends React.Component {
  static propTypes = {
    selectedRows: PropTypes.instanceOf(Immutable.Set),
    clearSelection: PropTypes.func,
    deleteSelection: PropTypes.func,
    onNewClick: PropTypes.func,
    toggleColumn: PropTypes.func,
    hiddenColumns: PropTypes.object,
    searchValue: PropTypes.string,
    onSearchChange: PropTypes.func,
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
  }

  renderColumnToggle(label, columnName, icon) {
    const classes = ['btn', 'btn-success']
    if (this.props.hiddenColumns[columnName]) {
      classes.push('active')
    }

    if (icon) {
      return (
        <ButtonIcon
          className={classes.join(' ')}
          icon={icon}
          onClick={() => this.props.toggleColumn(columnName)}
        >
          {label}
        </ButtonIcon>
      )
    }
    return (
      <Button
        className={classes.join(' ')}
        onClick={() => this.props.toggleColumn(columnName)}
      >
        {label}
      </Button>
    )
  }

  render() {
    return (
      <div>
        <TransactionToolbarRow>
          <div className="btn-group">
            <ButtonIcon
              className="btn btn-info"
              onClick={() => this.props.onNewClick()}
              icon="plus"
            >
              New
            </ButtonIcon>

            {this.props.selectedRows.size > 0 && (
              <ButtonIcon
                className="btn btn-warning"
                onClick={() => this.props.clearSelection()}
                icon="ban"
              >
                Deselect ({this.props.selectedRows.size})
              </ButtonIcon>
            )}

            {this.props.selectedRows.size > 0 && (
              <ButtonDelete onClick={this.props.deleteSelection}>
                Delete ({this.props.selectedRows.size})
              </ButtonDelete>
            )}

            <ButtonIcon
              className="btn btn-info"
              onClick={() =>
                this.props.updateUI(
                  'filtersVisible',
                  !this.props.ui.filtersVisible
                )
              }
              icon="filter"
            />
          </div>

          <div>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">
                <FontAwesome name="search" fixedWidth />
              </span>
              <input
                type="text"
                value={this.props.searchValue}
                onChange={this.props.onSearchChange}
                className="form-control"
                placeholder="Search"
              />
            </div>
          </div>
        </TransactionToolbarRow>

        {this.props.ui.filtersVisible && (
          <TransactionToolbarRow>
            <div className="btn-group">
              {this.renderColumnToggle('Account', 'account', 'bank')}
              {this.renderColumnToggle('Date', 'display_date', 'calendar')}
              {this.renderColumnToggle('Time', 'time', 'clock-o')}
              {this.renderColumnToggle('Payee', 'payee')}
              {this.renderColumnToggle('Category', 'category')}
              {this.renderColumnToggle('Description', 'description')}
              {this.renderColumnToggle('Tags', 'tags', 'tags')}
              {this.renderColumnToggle('Amount', 'amount')}
            </div>
          </TransactionToolbarRow>
        )}
      </div>
    )
  }
}

export default TransactionToolbar
