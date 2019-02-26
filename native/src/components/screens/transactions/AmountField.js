import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native'
import {colors} from '../../../constants/colors'

export class AmountField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        isOutcome: PropTypes.bool.isRequired,
      }).isRequired,
      onChange: PropTypes.func.isRequired,
    }).isRequired,
  }

  textInputValue = () => this.props.input.value.amount.toString()

  setValue = value => {
    this.props.input.onChange({
      ...this.props.input.value,
      amount: Number(value),
    })
  }

  setOutcome = () => {
    this.props.input.onChange({...this.props.input.value, isOutcome: true})
  }

  setIncome = () => {
    this.props.input.onChange({...this.props.input.value, isOutcome: false})
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.textInputValue()}
          onChangeText={this.setValue}
          placeholder="Amount"
          style={[
            styles.input,
            {
              color: this.props.input.value.isOutcome
                ? colors.red
                : colors.green,
            },
          ]}
          keyboardType="numeric"
        />

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.button} onPress={this.setIncome}>
            <Text style={styles.textIncome}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.setOutcome}>
            <Text style={styles.textOutcome}>Outcome</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#313131',
  },

  input: {
    height: 50,
    paddingHorizontal: 24,
    fontSize: 28,
    textAlign: 'right',
  },

  button: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },

  textIncome: {
    color: colors.green,
  },

  textOutcome: {
    color: colors.red,
  },
})
