import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'
import {getAvailableToBudget} from 'inab-shared'
import {Amount} from '../../Amount'
import {colors} from '../../../constants/colors'

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
})

@connect(mapStateToProps)
export class BudgetHeader extends React.Component {
  static propTypes = {
    availableToBudget: PropTypes.number.isRequired,
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>To budget</Text>
        <Amount value={this.props.availableToBudget} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    backgroundColor: colors.banner,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
