// @flow
import PropTypes from 'prop-types'
// eslint-disable-next-line import/named
import type {ResourceDefinition} from 'redux-crud-provider'

export const CategoryGroupResource: ResourceDefinition = {
  name: 'category_groups',
  key: 'uuid',
  defaultPath: 'category-groups',
  propTypes: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
  }),
}

export type CategoryGroup = {
  uuid: string,
  name: string,
  priority: number,
}
