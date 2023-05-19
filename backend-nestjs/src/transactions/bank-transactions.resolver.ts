import {BankTransactionService} from './bank-transaction.service'
import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql'
import {BankTransactionObjectType} from './models/bank-transaction.model'

@Resolver(() => BankTransactionObjectType)
export class BankTransactionsResolver {
  constructor(private bankTransactionService: BankTransactionService) {}

  @Query(() => [BankTransactionObjectType])
  async transactions(): Promise<BankTransactionObjectType[]> {
    return this.bankTransactionService.findAll()
  }

  @Query(() => BankTransactionObjectType)
  async transaction(
    @Args('uuid', {type: () => ID}) uuid: string
  ): Promise<BankTransactionObjectType> {
    return this.bankTransactionService.findOne(uuid)
  }

  @Mutation(() => BankTransactionObjectType)
  async setBankTransactionPayee(
    @Args('bankTransactionUuid', {type: () => ID}) bankTransactionUuid: string,
    @Args('payeeUuid', {type: () => ID, nullable: true}) payeeUuid: string
  ): Promise<BankTransactionObjectType> {
    await this.bankTransactionService.setPayee({
      bankTransactionUuid: bankTransactionUuid,
      payeeUuid: payeeUuid,
    })
    return this.bankTransactionService.findOne(bankTransactionUuid)
  }
}
