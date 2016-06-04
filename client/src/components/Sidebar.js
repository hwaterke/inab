import React from 'react';
import Link from './Link';
import Button from './Button';
import * as actions from '../actions/page';
import { connect } from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';

class Sidebar extends React.Component {

  componentDidMount() {
    if (this.props.accounts.length == 0) {
      this.props.fetch();
    }
  }


  render() {
    return (
      <ul className="nav sidebar-nav">
        <li><Link children="Budget" onClick={() => this.props.selectPage('BUDGET')} /></li>
        {this.props.accounts.map((account) =>
          <li key={account.id}>
            <Link children={account.name} onClick={() => this.props.selectPage('ACCOUNT', account.id)} />
          </li>
        )}
        <li><Button children="Add account" onClick={() => this.props.create({name: 'lol'})} /></li>
      </ul>
    );
  }
}

Sidebar.propTypes = {
  selectPage: React.PropTypes.func.isRequired,
  accounts: React.PropTypes.array.isRequired,
  fetch: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({accounts: state.accounts});
export default connect(mapStateToProps, Object.assign({}, actions, asyncActionCreatorsFor('accounts')))(Sidebar);
