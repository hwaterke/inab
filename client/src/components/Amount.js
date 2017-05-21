import React from 'react';
import PropTypes from 'prop-types';
import {amountFromCents} from 'inab-shared';
import './Amount.scss';

class Amount extends React.Component {
  static propTypes = {
    amount: PropTypes.number,
    color: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const amount = this.props.amount || 0;
    const styles = [];

    if (this.props.color) {
      styles.push('amount-color');
    }

    if (amount < 0) {
      styles.push('amount-negative');
    } else if (amount > 0) {
      styles.push('amount-positive');
    } else {
      styles.push('amount-zero');
    }

    if (this.props.className) {
      styles.push(this.props.className);
    }

    return (
      <span className={styles.join(' ')}>
        {amountFromCents(amount).toLocaleString(undefined, {style: 'currency', currency: 'EUR'})}
      </span>
    );
  }
}

export default Amount;
