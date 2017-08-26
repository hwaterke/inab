import React from 'react';
import PropTypes from 'prop-types';

export class PayeeDetail extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <p>PayeeDetail</p>
        <pre>
          {JSON.stringify(this.props.match)}
        </pre>
      </div>
    );
  }
}
