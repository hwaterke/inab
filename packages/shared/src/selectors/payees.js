import {prop, sortBy} from 'ramda'
import {createSelector} from 'reselect'
import {select} from 'redux-crud-provider'
import {PayeeResource} from '../entities/Payee'

export const getSortedPayees = createSelector(
  select(PayeeResource).asArray,
  payees => sortBy(prop('name'), payees)
)
