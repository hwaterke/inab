import { createGroupingSelector } from './utils';

// All
export const getSubtransactions = state => state.subtransactions;

export const getSubtransactionsByTransactionId = createGroupingSelector(getSubtransactions, 'transaction_id');
