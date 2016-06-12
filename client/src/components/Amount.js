import React from 'react';

const amountStyle = {
  fontWeight: 'bold'
};

const colorStyle = {
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px'
};

const neutral = {
  color: '#888'
};

const positiveStyle = {
  backgroundColor: '#84ECAE'
};

const negativeStyle = {
  backgroundColor: '#FFA48F'
};

class Amount extends React.Component {
  static propTypes= {
    amount: React.PropTypes.number,
    color: React.PropTypes.bool
  };

  render() {
    const amount = this.props.amount || 0;
    var styles;
    if (this.props.color) {
      styles = Object.assign({}, amountStyle, colorStyle, (amount >= 0 ? positiveStyle : negativeStyle));
    } else {
      styles = Object.assign({}, amountStyle, amount == 0 ? neutral : {} );
    }

    return (
      <span style={styles}>{(amount / 100).toFixed(2)}</span>
    );
  }
}

export default Amount;
