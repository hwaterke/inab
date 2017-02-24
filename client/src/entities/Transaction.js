// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

const tagPropType: ReactPropsCheckType = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired
});

const subtransactionPropType: ReactPropsCheckType = React.PropTypes.shape({
  id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  description: React.PropTypes.string,
  amount: React.PropTypes.number.isRequired,
  category_id: React.PropTypes.number.isRequired,
});

export const TransactionResource: ResourceDefinition = {
  path: 'transactions',
  propType: React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    date: React.PropTypes.string.isRequired,
    time: React.PropTypes.string,
    payee: React.PropTypes.string,
    description: React.PropTypes.string,
    amount: React.PropTypes.number.isRequired,
    category_id: React.PropTypes.number,
    account_id: React.PropTypes.number.isRequired,
    transfer_account_id: React.PropTypes.number,
    type: React.PropTypes.string.isRequired,
    tags: React.PropTypes.arrayOf(tagPropType).isRequired,
    subtransactions: React.PropTypes.arrayOf(subtransactionPropType).isRequired
  })
};

export type TransactionTag = {
  name: string;
}

export type Subtransaction = {
  id: number | string;
  description: string;
  amount: number;
  category_id: number | string;
}

export type Transaction = {
  id: number | string;
  date: string;
  payee: string;
  description: string;
  amount: number;
  category_id: number | string;
  account_id: number | string;
  transfer_account_id: number | string;
  type: string;
  tags: TransactionTag[];
  subtransactions: Subtransaction[];
}
