import {BankTransactionService} from './bank-transaction.service'
import {
  Args,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql'
import {
  BankTransactionItemInputType,
  BankTransactionItemObjectType,
  BankTransactionListObjectType,
  BankTransactionObjectType,
} from './models/bank-transaction.model'
import {PaginationInput} from '../shared/models/pagination.model'

@InputType()
class TransactionFiltersInputType {
  @Field(() => [ID], {nullable: true})
  bankAccounts!: string[] | null

  @Field(() => Boolean, {nullable: true})
  creditsMissingReimbursement!: boolean | null

  @Field(() => Boolean, {nullable: true})
  withPayee!: boolean | null

  @Field(() => Boolean, {nullable: true})
  missingCategory!: boolean | null

  @Field(() => String, {nullable: true})
  search!: string | null
}

@Resolver(() => BankTransactionObjectType)
export class BankTransactionsResolver {
  constructor(private bankTransactionService: BankTransactionService) {}

  @Query(() => BankTransactionListObjectType)
  async transactions(
    @Args('pagination', {type: () => PaginationInput})
    pagination: PaginationInput,
    @Args('filters', {type: () => TransactionFiltersInputType, nullable: true})
    filters: TransactionFiltersInputType | null
  ): Promise<BankTransactionListObjectType> {
    return this.bankTransactionService.findAll({
      page: pagination.page,
      pageSize: pagination.pageSize,
      bankAccounts: filters?.bankAccounts ?? null,
      search: filters?.search ?? null,
      creditsMissingReimbursement:
        filters?.creditsMissingReimbursement ?? false,
      withPayee: filters?.withPayee ?? null,
      missingCategory: filters?.missingCategory ?? null,
    })
  }

  @Query(() => BankTransactionObjectType)
  async transaction(
    @Args('uuid', {type: () => ID}) uuid: string
  ): Promise<BankTransactionObjectType> {
    return this.bankTransactionService.findOne(uuid)
  }

  @Mutation(() => Boolean)
  async setBankTransactionPayee(
    @Args('bankTransactionUuids', {type: () => [ID]})
    bankTransactionUuids: string[],
    @Args('payeeUuid', {type: () => ID, nullable: true}) payeeUuid: string
  ): Promise<boolean> {
    await this.bankTransactionService.setPayee({
      bankTransactionUuids: bankTransactionUuids,
      payeeUuid: payeeUuid,
    })
    return true
  }

  @Query(() => [BankTransactionItemObjectType])
  async transactionItems(): Promise<BankTransactionItemObjectType[]> {
    return this.bankTransactionService.findAllItems()
  }

  @Query(() => [BankTransactionItemObjectType])
  async creditTransactionItemsMissingReimbursement(): Promise<
    BankTransactionItemObjectType[]
  > {
    return this.bankTransactionService.findCreditsMissingReimbursement()
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
