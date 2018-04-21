import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared';
import {PayeeResource} from '../entities/Payee';

export const getSortedPayees = createSelector(arraySelector(PayeeResource), payees =>
  R.sortBy(R.prop('name'), payees)
);
