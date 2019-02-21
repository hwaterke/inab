import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {
  getSelectedMonthMoment,
  selectPreviousMonth,
  selectNextMonth,
  selectMonth,
} from '@inab/shared'
import {Ionicons} from '@expo/vector-icons'
import moment from 'moment'
import {colors} from '../../../constants/colors'

const mapStateToProps = state => ({
  selectedMonthMoment: getSelectedMonthMoment(state),
})

const mapDispatchToProps = {
  selectPreviousMonth,
  selectNextMonth,
  selectMonth,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export class MonthSelector extends React.Component {
  static propTypes = {
    selectedMonthMoment: PropTypes.object.isRequired,
    selectPreviousMonth: PropTypes.func.isRequired,
    selectNextMonth: PropTypes.func.isRequired,
    selectMonth: PropTypes.func.isRequired,
  }

  selectCurrentMonth = () => {
    const now = moment()
    this.props.selectMonth(now.year(), now.month())
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.props.selectPreviousMonth}
          style={styles.childIcons}
        >
          <Ionicons name="ios-arrow-back" size={26} style={styles.white} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.selectCurrentMonth}
          style={styles.child}
        >
          <Text style={styles.monthText}>
            {this.props.selectedMonthMoment.format('MMMM-YYYY')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.props.selectNextMonth}
          style={styles.childIcons}
        >
          <Ionicons name="ios-arrow-forward" size={26} style={styles.white} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.banner,
  },

  childIcons: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  child: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthText: {
    color: 'white',
    fontSize: 18,
  },

  white: {
    color: 'white',
  },
})
