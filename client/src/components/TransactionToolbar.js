import React from 'react';
import * as Immutable from 'immutable';
import Button from './Button';
import ButtonIcon from './ButtonIcon';
import ButtonDelete from './ButtonDelete';
import ui from 'redux-ui';
import './TransactionToolbar.scss';
import FontAwesome from 'react-fontawesome';

@ui({
  state: {
    filtersVisible: false
  }
})
class TransactionToolbar extends React.Component {

  static propTypes = {
    selectedRows: React.PropTypes.instanceOf(Immutable.Set),
    clearSelection: React.PropTypes.func,
    deleteSelection: React.PropTypes.func,
    onNewClick: React.PropTypes.func,
    toggleColumn: React.PropTypes.func,
    hiddenColumns: React.PropTypes.object,
    searchValue: React.PropTypes.string,
    onSearchChange: React.PropTypes.func,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
  };

  renderColumnToggle(columnName, icon) {
    const classes = ['btn', 'btn-success'];
    if (this.props.hiddenColumns[columnName]) {
      classes.push('active');
    }

    if (icon) {
      return <ButtonIcon
        className={classes.join(' ')}
        icon={icon}
        onClick={() => this.props.toggleColumn(columnName)}
      >{columnName.toUpperCase()}</ButtonIcon>;
    }
    return <Button
      className={classes.join(' ')}
      onClick={() => this.props.toggleColumn(columnName)}
    >{columnName.toUpperCase()}</Button>;
  }

  render() {
    return (
      <div>
        <div className="transaction-toolbar">
          <div className="btn-group">
            <ButtonIcon
              className="btn btn-info"
              onClick={() => this.props.onNewClick()}
              icon="plus"
            >
              New
            </ButtonIcon>

            {
              this.props.selectedRows.size > 0 &&
              <ButtonIcon
                className="btn btn-warning"
                onClick={() => this.props.clearSelection()}
                icon="ban"
              >
                Deselect ({this.props.selectedRows.size})
              </ButtonIcon>
            }

            {
              this.props.selectedRows.size > 0 &&
              <ButtonDelete onClick={this.props.deleteSelection}>
                Delete ({this.props.selectedRows.size})
              </ButtonDelete>
            }

            <ButtonIcon
              className="btn btn-info"
              onClick={() => this.props.updateUI('filtersVisible', !this.props.ui.filtersVisible)}
              icon="filter"
            />
          </div>

          <div className="transaction-toolbar-search">
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
        </div>

        {
          this.props.ui.filtersVisible &&
          <div className="transaction-toolbar">
            <div className="btn-group">
              {this.renderColumnToggle('account', 'bank')}
              {this.renderColumnToggle('date', 'calendar')}
              {this.renderColumnToggle('payee')}
              {this.renderColumnToggle('category')}
              {this.renderColumnToggle('description')}
              {this.renderColumnToggle('amount')}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default TransactionToolbar;
