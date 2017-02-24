// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const BudgetItemResource: ResourceDefinition = {
  path: 'budget_items',
  propType: React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    month: React.PropTypes.string.isRequired,
    amount: React.PropTypes.number.isRequired,
    category_id: React.PropTypes.number.isRequired
  })
};

export type BudgetItem = {
  id: number | string;
  month: string;
  amount: number;
  category_id: number | string;
}
