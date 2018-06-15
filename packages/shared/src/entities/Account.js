// @flow
import PropTypes from 'prop-types'
// eslint-disable-next-line import/named
import type {ResourceDefinition} from 'redux-crud-provider'

export const AccountResource: ResourceDefinition = {
  name: 'accounts',
  key: 'uuid',
  defaultPath: 'accounts',
  propTypes: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
  }),
}

export type Account = {
  uuid: string,
  name: string,
}
