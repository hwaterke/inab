import {BankTransactionService} from './bank-transaction.service'
import {Query, Resolver} from '@nestjs/graphql'
import {BankTransactionObjectType} from './models/bank-transaction.model'

@Resolver(() => BankTransactionObjectType)
export class BankTransactionsResolver {
  constructor(private bankTransactionService: BankTransactionService) {}

  @Query(() => [BankTransactionObjectType])
  async transactions(): Promise<BankTransactionObjectType[]> {
    return this.bankTransactionService.findAll()
  }
}
