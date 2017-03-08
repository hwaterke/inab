// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const BudgetItemResource: ResourceDefinition = {
  path: 'budget_items',
  propType: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    month: React.PropTypes.string.isRequired,
    amount: React.PropTypes.number.isRequired,
    category_uuid: React.PropTypes.string.isRequired
  })
};

export type BudgetItem = {
  uuid: string;
  month: string;
  amount: number;
  category_uuid: string;
}
