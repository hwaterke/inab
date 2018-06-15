// @flow
import PropTypes from 'prop-types'
// eslint-disable-next-line import/named
import type {ResourceDefinition} from 'redux-crud-provider'

const locationPropType: ReactPropsCheckType = PropTypes.shape({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
})

export const PayeeResource: ResourceDefinition = {
  name: 'payees',
  key: 'uuid',
  defaultPath: 'payees',
  propTypes: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(locationPropType).isRequired,
  }),
}

export type Location = {
  latitude: number,
  longitude: number,
}

export type Payee = {
  uuid: string,
  name: string,
  locations: Location[],
}
