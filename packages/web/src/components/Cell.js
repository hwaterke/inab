import PropTypes from 'prop-types'
import styled from 'styled-components'

export const Cell = styled.td`
  text-align: ${(props) => (props.alignRight ? 'right' : 'left')};
`

Cell.propTypes = {
  alignRight: PropTypes.bool,
}
