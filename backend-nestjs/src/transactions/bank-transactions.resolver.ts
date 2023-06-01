import {BankTransactionService} from './bank-transaction.service'
import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql'
import {
  BankTransactionItemInputType,
  BankTransactionItemObjectType,
  BankTransactionListObjectType,
  BankTransactionObjectType,
} from './models/bank-transaction.model'
import {PaginationInput} from '../shared/models/pagination.model'

@Resolver(() => BankTransactionObjectType)
export class BankTransactionsResolver {
  constructor(private bankTransactionService: BankTransactionService) {}

  @Query(() => BankTransactionListObjectType)
  async transactions(
    @Args('pagination', {type: () => PaginationInput})
    pagination: PaginationInput,
    @Args('bankAccounts', {type: () => [ID], nullable: true})
    bankAccounts: string[] | null
  ): Promise<BankTransactionListObjectType> {
    return this.bankTransactionService.findAll({
      page: pagination.page,
      pageSize: pagination.pageSize,
      bankAccounts,
    })
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

  @Query(() => [BankTransactionItemObjectType])
  async transactionItems(): Promise<BankTransactionItemObjectType[]> {
    return this.bankTransactionService.findAllItems()
  }

  @Mutation(() => BankTransactionObjectType)
  async addTransactionItem(
    @Args('bankTransactionUuid', {type: () => ID}) bankTransactionUuid: string,
    @Args('item') item: BankTransactionItemInputType
  ): Promise<BankTransactionObjectType> {
    await this.bankTransactionService.addItem(bankTransactionUuid, item)
    return this.bankTransactionService.findOne(bankTransactionUuid)
  }

  @Mutation(() => BankTransactionObjectType)
  async updateTransactionItem(
    @Args('bankTransactionUuid', {type: () => ID}) bankTransactionUuid: string,
    @Args('itemUuid', {type: () => ID}) itemUuid: string,
    @Args('item') item: BankTransactionItemInputType
  ): Promise<BankTransactionObjectType> {
    await this.bankTransactionService.updateItem(
      bankTransactionUuid,
      itemUuid,
      item
    )
    return this.bankTransactionService.findOne(bankTransactionUuid)
  }

  @Mutation(() => BankTransactionObjectType)
  async deleteTransactionItem(
    @Args('bankTransactionUuid', {type: () => ID}) bankTransactionUuid: string,
    @Args('itemUuid', {type: () => ID}) itemUuid: string
  ): Promise<BankTransactionObjectType> {
    await this.bankTransactionService.removeItem(bankTransactionUuid, itemUuid)
    return this.bankTransactionService.findOne(bankTransactionUuid)
  }
}
