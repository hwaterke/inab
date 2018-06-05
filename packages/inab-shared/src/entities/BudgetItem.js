// @flow
import PropTypes from 'prop-types'
// eslint-disable-next-line import/named
import type {ResourceDefinition} from 'redux-crud-provider'

export const BudgetItemResource: ResourceDefinition = {
  name: 'budget_items',
  key: 'uuid',
  defaultPath: 'budget-items',
  propTypes: PropTypes.shape({
    uuid: PropTypes.string,
    month: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category_uuid: PropTypes.string.isRequired,
  }),
}

export type BudgetItem = {
  uuid: string,
  month: string,
  amount: number,
  category_uuid: string,
}
