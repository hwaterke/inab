import React from 'react';

const amountStyle = {
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontWeight: 'bold'
};

const positiveStyle = {
  backgroundColor: '#84ECAE'
};

const negativeStyle = {
  backgroundColor: '#FFA48F'
};

class Amount extends React.Component {
  static propTypes= {
    amount: React.PropTypes.number
  };

  render() {
    const styles = Object.assign({}, amountStyle, (this.props.amount >= 0 ? positiveStyle : negativeStyle));
    return (
      <span style={styles}>{(this.props.amount / 100).toFixed(2)}</span>
    );
  }
}

export default Amount;
