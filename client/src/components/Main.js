import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BudgetPage from './Budget';
import AccountPage from './AccountPage';
import { connect } from 'react-redux';


class Main extends React.Component {
  render() {
    const page = (this.props.page == 'BUDGET') ? <BudgetPage /> : <AccountPage />;
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
              <Sidebar />
            </div>
            <div className="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2">
              {page}
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

const mapStateToProps = (state) => ({page: state.selectedPage});
export default connect(mapStateToProps)(Main);
