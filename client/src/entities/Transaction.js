// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

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
    payee: React.PropTypes.string,
    description: React.PropTypes.string,
    amount: React.PropTypes.number.isRequired,
    category_id: React.PropTypes.number,
    account_id: React.PropTypes.number.isRequired,
    transfer_account_id: React.PropTypes.number,
    type: React.PropTypes.string.isRequired,
    subtransactions: React.PropTypes.arrayOf(subtransactionPropType).isRequired
  })
};
