var React = require('react');
var ReactDOM = require('react-dom');

class Main extends React.Component {
  render() {
    return (
      <div>Hello World</div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
