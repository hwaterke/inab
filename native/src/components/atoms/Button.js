import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {colors} from '../../constants/colors'

const ButtonContainer = styled.TouchableOpacity`
  align-items: center;
  padding: 12px;
  margin-top: 12px;
  background-color: ${colors.banner};
`

const Text = styled.Text`
  color: #000;
`

export const Button = ({children, onPress}) => (
  <ButtonContainer onPress={onPress}>
    <Text>{children}</Text>
  </ButtonContainer>
)

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}
