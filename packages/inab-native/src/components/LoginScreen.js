import React from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {Field, reduxForm} from 'redux-form'
import axios from 'axios'
import {connect} from 'react-redux'
import {selectBackend, selectEmail, setCredentials} from 'inab-shared'
// eslint-disable-next-line import/named
import {LinearGradient} from 'expo'
import {TextInputField} from './fields/TextInputField'

const mapStateToProps = state => ({
  initialValues: {
    backend: selectBackend(state),
    email: selectEmail(state),
  },
})

const mapDispatchToProps = {
  setCredentials,
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: 'login', enableReinitialize: true})
export class LoginScreen extends React.Component {
  static propTypes = {
    setCredentials: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  onSubmit = data => {
    this.props.setCredentials({
      backend: data.backend,
      email: data.email,
    })
    this.performLogin(data.backend, data.email, data.password)
  }

  performLogin = (backend, email, password) => {
    axios({
      url: `${backend}/auth/login`,
      method: 'POST',
      data: {
        email,
        password,
      },
    })
      .then(response => {
        if (response.headers.authorization) {
          // Dispatch save token
          this.props.setCredentials({token: response.headers.authorization})
        } else {
          alert('Login error')
        }
      })
      .catch(err => alert('Login error: ' + err.toString()))
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#ABDCFF', '#0396FF']}
          style={styles.container}
          start={[0.25, 0.0]}
          end={[1.0, 1.0]}
        >
          <View style={styles.logoContainer}>
            <Image source={require('../assets/icons/login.png')} />
          </View>

          <View style={styles.fieldWrapper}>
            <Field
              name="backend"
              component={TextInputField}
              placeholder="Server"
              autoCapitalize="none"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.field}
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Field
              name="email"
              component={TextInputField}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.field}
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Field
              name="password"
              component={TextInputField}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.field}
            />
          </View>

          <TouchableOpacity
            onPress={this.props.handleSubmit(this.onSubmit)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableWithoutFeedback>
    )
  }
}

const verticalSpacing = 12

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 3 * verticalSpacing,
  },

  field: {
    height: 40,
    color: 'white',
  },

  fieldWrapper: {
    marginHorizontal: 24,
    marginVertical: verticalSpacing,
    borderBottomColor: 'rgba(255,255,255,.6)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.1)',
    padding: verticalSpacing,
    marginHorizontal: 24,
    marginTop: verticalSpacing,
  },

  buttonText: {
    fontSize: 18,
    color: 'white',
  },
})
