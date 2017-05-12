// @flow
import React from 'react';
import type {ResourceDefinition} from 'hw-react-shared/src/crud/types/ResourceDefinition';

const tagPropType: ReactPropsCheckType = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired
});

const subtransactionPropType: ReactPropsCheckType = React.PropTypes.shape({
  uuid: React.PropTypes.string,
  description: React.PropTypes.string,
  amount: React.PropTypes.number.isRequired,
  category_uuid: React.PropTypes.string.isRequired
});

export const TransactionResource: ResourceDefinition = {
  path: 'transactions',
  propType: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    date: React.PropTypes.string.isRequired,
    time: React.PropTypes.string,
    payee: React.PropTypes.string,
    description: React.PropTypes.string,
    amount: React.PropTypes.number.isRequired,
    category_uuid: React.PropTypes.string,
    account_uuid: React.PropTypes.string.isRequired,
    transfer_account_uuid: React.PropTypes.string,
    type: React.PropTypes.string.isRequired,
    tags: React.PropTypes.arrayOf(tagPropType).isRequired,
    subtransactions: React.PropTypes.arrayOf(subtransactionPropType).isRequired
  })
};

export type TransactionTag = {
  name: string
};

export type Subtransaction = {
  uuid: string,
  description: string,
  amount: number,
  category_uuid: string
};

export type Transaction = {
  uuid: string,
  date: string,
  time: string,
  payee: string,
  description: string,
  amount: number,
  category_uuid: string,
  account_uuid: string,
  transfer_account_uuid: string,
  type: string,
  tags: TransactionTag[],
  subtransactions: Subtransaction[]
};
