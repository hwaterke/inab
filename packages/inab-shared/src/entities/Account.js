// @flow
import PropTypes from 'prop-types'
import type {ResourceDefinition} from 'hw-react-shared'

export const AccountResource: ResourceDefinition = {
  path: 'accounts',
  propType: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
  }),
}

export type Account = {
  uuid: string,
  name: string,
}
