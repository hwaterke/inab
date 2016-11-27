import React from 'react';
import Header from './Header';
import EntityLoader from './EntityLoader';
import BudgetPage from './Budget';
import AccountPage from './AccountPage';
import { connect } from 'react-redux';
import ErrorList from './ErrorList';

class Main extends React.Component {
  render() {
    return (
      <div>
        <EntityLoader />
        <Header />
        <div className="container-fluid">
          <div className="row">
            <ErrorList />
            {(this.props.page == 'BUDGET') ? <BudgetPage /> : <AccountPage />}
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  page: React.PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({page: state.selectedPage.name});
export default connect(mapStateToProps)(Main);
