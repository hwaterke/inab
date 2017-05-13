// @flow
import PropTypes from 'prop-types';
import type {ResourceDefinition} from 'hw-react-shared/src/crud/types/ResourceDefinition';

export const CategoryResource: ResourceDefinition = {
  path: 'categories',
  propType: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
    category_group_uuid: PropTypes.string.isRequired
  })
};

export type Category = {
  uuid: string,
  name: string,
  priority: number,
  category_group_uuid: string
};
