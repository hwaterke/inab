// @flow
import PropTypes from 'prop-types';
import type {ResourceDefinition} from 'hw-react-shared';

const locationPropType: ReactPropsCheckType = PropTypes.shape({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
});

export const PayeeResource: ResourceDefinition = {
  path: 'payees',
  propType: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(locationPropType).isRequired
  })
};

export type Location = {
  latitude: number,
  longitude: number
};

export type Payee = {
  uuid: string,
  name: string,
  locations: Location[]
};
