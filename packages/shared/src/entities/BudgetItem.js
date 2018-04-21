// @flow
import PropTypes from 'prop-types';
import type {ResourceDefinition} from 'hw-react-shared';

export const BudgetItemResource: ResourceDefinition = {
  path: 'budget_items',
  propType: PropTypes.shape({
    uuid: PropTypes.string,
    month: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category_uuid: PropTypes.string.isRequired
  })
};

export type BudgetItem = {
  uuid: string,
  month: string,
  amount: number,
  category_uuid: string
};
