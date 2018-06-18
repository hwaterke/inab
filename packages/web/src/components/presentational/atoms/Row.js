import PropTypes from 'prop-types'
import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  justify-content: ${({justifyContent}) => justifyContent};
`

Row.propTypes = {
  justifyContent: PropTypes.string,
}

Row.defaultProps = {
  justifyContent: 'space-between',
}
