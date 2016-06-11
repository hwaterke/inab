import React from 'react';
import Header from './Header';
import EntityLoader from './EntityLoader';
import BudgetPage from './Budget';
import AccountPage from './AccountPage';
import { connect } from 'react-redux';


class Main extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <EntityLoader />
            <div className="col-md-12">
              {(this.props.page == 'BUDGET') ? <BudgetPage /> : <AccountPage />}
            </div>
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
