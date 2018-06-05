import React from 'react'
import {View} from 'react-native'
import {globalStyles} from '../../../constants/styles'
import {Banner} from '../../Banner'
import {MonthSelector} from './MonthSelector'
import {BudgetList} from './BudgetList'
import {BudgetHeader} from './BudgetHeader'

export class BudgetScreen extends React.Component {
  render() {
    return (
      <View style={globalStyles.screen}>
        <Banner />
        <MonthSelector />
        <BudgetHeader />
        <BudgetList />
      </View>
    )
  }
}
