import React from 'react';
import {View} from 'react-native';
import {MonthSelector} from './MonthSelector';
import {globalStyles} from '../../../constants/styles';
import {Banner} from '../../Banner';
import {BudgetList} from './BudgetList';

export class BudgetScreen extends React.Component {
  render() {
    return (
      <View style={globalStyles.screen}>
        <Banner />
        <MonthSelector />
        <BudgetList />
      </View>
    );
  }
}
