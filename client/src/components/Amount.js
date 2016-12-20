import React from "react";
import "./Amount.scss";

class Amount extends React.Component {
  static propTypes = {
    amount: React.PropTypes.number,
    color: React.PropTypes.bool,
    className: React.PropTypes.string,
  };

  render() {
    const amount = this.props.amount || 0;
    const styles = ['amount'];
    if (this.props.color) {
      styles.push(amount < 0 ? 'amount-negative' : 'amount-positive');
    } else if (amount == 0) {
      styles.push('amount-faded');
    }
    if (this.props.className) {
      styles.push(this.props.className);
    }
    return (
      <span className={styles.join(' ')}>
        {(amount / 100).toLocaleString(undefined, {style: 'currency', currency: 'EUR'})}
      </span>
    );
  }
}

export default Amount;
