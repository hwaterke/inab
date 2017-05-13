import React from 'react';
import PropTypes from 'prop-types';
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
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired
      })
    ).isRequired,
    input: PropTypes.shape({
      value: PropTypes.any.isRequired,
      onChange: PropTypes.func.isRequired
    }).isRequired
  };

  createFromSearch(options, search) {
    if (search.length == 0 || options.map(option => option.label).indexOf(search) > -1) {
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
        value={this.state.options.find(i => i.value == this.props.input.value)}
        onValueChange={this.onValueChangeInternal}
      />
    );
  }
}

export default SimpleSelectCreateField;
