import React from 'react';
import {SimpleSelect} from 'react-selectize';
import './SimpleSelect.scss';

class SimpleSelectCreateField extends React.Component {
  constructor(props) {
    super(props);
    // Initial state from props seems to be an anti pattern. Find alternative.
    this.state = {options: props.options};
    this.createFromSearch = this.createFromSearch.bind(this);
    this.onValueChangeInternal = this.onValueChangeInternal.bind(this);
  }

  static propTypes = {
    placeholder: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    options: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.any.isRequired
    })).isRequired,
    input: React.PropTypes.shape({
      value: React.PropTypes.any.isRequired,
      onChange: React.PropTypes.func.isRequired
    }).isRequired
  };

  createFromSearch(options, search) {
    if (search.length == 0 || (options.map(option => option.label)).indexOf(search) > -1) {
      return null;
    } else {
      return {label: search, value: search};
    }
  }

  onValueChangeInternal(item) {
    if (!!item && !!item.newOption) {
      this.state.options.unshift({label: item.label, value: item.value});
      this.setState({options: this.state.options});
    }
    this.props.input.onChange(item ? item.value : null);
  }

  render() {
    return (
      <SimpleSelect
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
        options={this.state.options}
        createFromSearch={this.createFromSearch}
        value={this.state.options.find((i) => i.value == this.props.input.value)}
        onValueChange={this.onValueChangeInternal}
      />
    );
  }
}

export default SimpleSelectCreateField;
