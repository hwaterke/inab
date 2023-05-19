import {TypedTypePolicies} from './gql/typePolicies.codegen.ts'

export const typePolicies: TypedTypePolicies = {
  BankAccountObjectType: {
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
