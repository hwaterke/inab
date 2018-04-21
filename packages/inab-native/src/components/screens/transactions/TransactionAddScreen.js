import React from 'react'
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native'
import {resourceForm} from 'hw-react-shared'
import {crud} from '../../hoc/crud'
import {TransactionResource} from 'inab-shared'
import {Field} from 'redux-form'
import {globalStyles} from '../../../constants/styles'
import {AmountField} from './AmountField'
import {Banner} from '../../Banner'

function formToResource(v) {
  return v
}

function resourceToForm(v) {
  return {
    amount: {
      amount: 0,
      isOutcome: true,
    },
    ...v,
  }
}

@resourceForm(crud, TransactionResource, formToResource, resourceToForm)
export class TransactionAddScreen extends React.Component {
  state = {
    language: undefined,
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={globalStyles.screen}>
          <Banner />
          <View>
            <Field name="amount" component={AmountField} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
