// @flow
import PropTypes from 'prop-types';
import type {ResourceDefinition} from 'hw-react-shared/src/crud/types/ResourceDefinition';

export const CategoryGroupResource: ResourceDefinition = {
  path: 'category_groups',
  propType: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired
  })
};

export type CategoryGroup = {
  uuid: string,
  name: string,
  priority: number
};
