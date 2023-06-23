import {TypedTypePolicies} from './gql/typePolicies.codegen.ts'

export const typePolicies: TypedTypePolicies = {
  BankTransactionListObjectType: {
    keyFields: false,
  },
  BankAccountObjectType: {
    keyFields: ['uuid'],
  },
  BankTransactionItemObjectType: {
    keyFields: ['uuid'],
  },
  BankTransactionObjectType: {
    keyFields: ['uuid'],
  },
  CategoryGroupObjectType: {
    keyFields: ['uuid'],
  },
  CategoryObjectType: {
    keyFields: ['uuid'],
  },
  PayeeObjectType: {
    keyFields: ['uuid'],
  },
}
