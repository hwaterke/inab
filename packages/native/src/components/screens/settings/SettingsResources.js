import React from 'react'
import PropTypes from 'prop-types'
import {Button, StyleSheet, Text, View} from 'react-native'
import {
  AccountResource,
  BudgetItemResource,
  CategoryGroupResource,
  CategoryResource,
  PayeeResource,
  TransactionResource,
} from '@inab/shared'
import {connect} from 'react-redux'
import {globalStyles} from '../../../constants/styles'
import {crudThunks} from '../../../thunks/crudThunks'

const mapStateToProps = state => ({
  resources: state.resources,
})

const mapDispatchToProps = {
  fetchAll: crudThunks.fetchAll,
}

@connect(mapStateToProps, mapDispatchToProps)
export class SettingsResources extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    fetchAll: PropTypes.func.isRequired,
  }

  fetchAll = async () => {
    const resources = [
      AccountResource,
      PayeeResource,
      CategoryGroupResource,
      CategoryResource,
      BudgetItemResource,
      TransactionResource,
    ]

    for (let resource of resources) {
      await this.props.fetchAll({resource, replace: true})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {Object.keys(this.props.resources).map(k => (
          <View key={k} style={styles.row}>
            <Text style={globalStyles.text}>{k}</Text>
            <Text>{Object.keys(this.props.resources[k]).length}</Text>
          </View>
        ))}
        <Button title="Fetch from server" onPress={this.fetchAll} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  row: {
    paddingVertical: 6,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
