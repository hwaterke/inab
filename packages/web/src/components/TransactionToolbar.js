import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import FontAwesome from 'react-fontawesome'
import ui from 'redux-ui'
import styled from 'styled-components'
import {Button} from './presentational/atoms/Button'
import {ButtonIcon} from './presentational/atoms/ButtonIcon'

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
    if (icon) {
      return (
        <ButtonIcon
          color="info"
          inverted={this.props.hiddenColumns[columnName]}
          icon={icon}
          onClick={() => this.props.toggleColumn(columnName)}
        >
          {label}
        </ButtonIcon>
      )
    }
    return (
      <Button
        color="info"
        inverted={this.props.hiddenColumns[columnName]}
        onClick={() => this.props.toggleColumn(columnName)}
      >
        {label}
      </Button>
    )
  }

  render() {
    return (
      <Fragment>
        <TransactionToolbarRow>
          <div className="buttons has-addons">
            <ButtonIcon
              color="info"
              onClick={() => this.props.onNewClick()}
              icon="plus"
            >
              New
            </ButtonIcon>

            {this.props.selectedRows.size > 0 && (
              <ButtonIcon
                color="warning"
                onClick={() => this.props.clearSelection()}
                icon="ban"
              >
                Deselect ({this.props.selectedRows.size})
              </ButtonIcon>
            )}

            {this.props.selectedRows.size > 0 && (
              <ButtonIcon
                color="danger"
                onClick={this.props.deleteSelection}
                icon="trash"
              >
                Delete ({this.props.selectedRows.size})
              </ButtonIcon>
            )}

            <ButtonIcon
              color="info"
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
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Search"
                  value={this.props.searchValue}
                  onChange={this.props.onSearchChange}
                />
                <span className="icon is-small is-left">
                  <FontAwesome name="search" />
                </span>
              </p>
            </div>
          </div>
        </TransactionToolbarRow>

        {this.props.ui.filtersVisible && (
          <TransactionToolbarRow>
            <div className="buttons has-addons">
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
      </Fragment>
    )
  }
}

export default TransactionToolbar
