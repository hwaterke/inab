import React from "react";
import ui from "redux-ui";
import Button from "./Button";
import ButtonIcon from "./ButtonIcon";

@ui()
class MonthSelector extends React.Component {

  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.previous = this.previous.bind(this);
    this.current = this.current.bind(this);
    this.next = this.next.bind(this);
  }

  previous() {
    const current_month = this.props.ui.month;
    if (current_month == 1) {
      this.props.updateUI({year: this.props.ui.year - 1, month: 12});
    } else {
      this.props.updateUI('month', current_month - 1);
    }
  }

  current() {
    const d = new Date;
    this.props.updateUI({year: d.getFullYear(), month: d.getMonth() + 1});
  }

  next() {
    const current_month = this.props.ui.month;
    if (current_month == 12) {
      this.props.updateUI({year: this.props.ui.year + 1, month: 1});
    } else {
      this.props.updateUI('month', current_month + 1);
    }
  }

  render() {
    return (
      <div className="btn-group" role="group">
        <ButtonIcon onClick={this.previous} icon="arrow-left"/>
        <Button onClick={this.current}>{this.props.ui.month}-{this.props.ui.year}</Button>
        <ButtonIcon onClick={this.next} icon="arrow-right"/>
      </div>
    );
  }

}

export default MonthSelector;
