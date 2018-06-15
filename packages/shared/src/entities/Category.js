// @flow
import PropTypes from 'prop-types'
// eslint-disable-next-line import/named
import type {ResourceDefinition} from 'redux-crud-provider'

export const CategoryResource: ResourceDefinition = {
  name: 'categories',
  key: 'uuid',
  defaultPath: 'categories',
  propTypes: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
    category_group_uuid: PropTypes.string.isRequired,

    goal_type: PropTypes.oneOf(['tb', 'tbd', 'mf']),
    goal_creation_month: PropTypes.string,
    target_balance: PropTypes.number,
    target_balance_month: PropTypes.string,
    monthly_funding: PropTypes.number,
  }),
}

export type Category = {
  uuid: string,
  name: string,
  priority: number,
  category_group_uuid: string,

  goal_type?: string,
  goal_creation_month?: string,
  target_balance?: number,
  target_balance_month?: string,
  monthly_funding?: number,
}
