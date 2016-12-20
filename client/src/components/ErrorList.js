import React from "react";
import {connect} from "react-redux";
import {dismissErrors} from "../actions/error.js";
import ButtonCheck from "./ButtonCheck";

class ErrorDialog extends React.Component {
  static propTypes = {
    errors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    dismissErrors: React.PropTypes.func.isRequired
  };

  render() {
    if (this.props.errors.length == 0) {
      return null;
    }

    return (
      <div className="col-md-12">
        <div>
          <ul className="list-group">
            {this.props.errors.map((err, i) =>
              <li key={i} className="list-group-item list-group-item-danger">
                {err}
              </li>)
            }
          </ul>
          <ButtonCheck onClick={this.props.dismissErrors}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({errors: state.errors});
const mapDispatchToProps = (dispatch) => ({dismissErrors: () => dispatch(dismissErrors())});
export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog);
