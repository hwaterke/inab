import React from 'react'
import PropTypes from 'prop-types'
import {Button, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'
import {FontAwesome} from '@expo/vector-icons'
import {clearToken, selectBackend, selectEmail} from '@inab/shared'
import {globalStyles} from '../../../constants/styles'

const mapStateToProps = state => ({
  backend: selectBackend(state),
  email: selectEmail(state),
})

const mapDispatchToProps = {
  clearToken,
}

@connect(mapStateToProps, mapDispatchToProps)
export class SettingsLogin extends React.Component {
  static propTypes = {
    backend: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    clearToken: PropTypes.func.isRequired,
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.icon}>
          <FontAwesome name="user-o" size={58} style={globalStyles.text} />
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.text}>Server</Text>
          <Text style={styles.lightText}>{this.props.backend}</Text>
        </View>

        <View style={styles.row}>
          <Text style={globalStyles.text}>Email</Text>
          <Text style={styles.lightText}>{this.props.email}</Text>
        </View>

        <Button title="Sign out" onPress={() => this.props.clearToken()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
  },

  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  row: {
    paddingVertical: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  lightText: {
    color: 'rgba(0,0,0,.6)',
  },
})
