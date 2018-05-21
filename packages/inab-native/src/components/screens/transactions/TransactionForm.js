import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TransactionResource} from 'inab-shared'
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native'
import {globalStyles} from '../../../constants/styles'
import {Banner} from '../../Banner'
import {AmountField} from './AmountField'

@reduxForm({form: TransactionResource.name})
export class TransactionForm extends React.Component {
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
