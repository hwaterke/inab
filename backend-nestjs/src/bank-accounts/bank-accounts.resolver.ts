import {BankAccountObjectType} from './models/bank-account.model'
import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql'
import {BankAccountService} from './bank-account.service'

@Resolver(() => BankAccountObjectType)
export class BankAccountsResolver {
  constructor(private bankAccountService: BankAccountService) {}

  @Query(() => [BankAccountObjectType])
  async accounts(): Promise<BankAccountObjectType[]> {
    return this.bankAccountService.findAll()
  }

  @Mutation(() => BankAccountObjectType)
  async createAccount(
    @Args('name') name: string,
    @Args('iban') iban: string
  ): Promise<BankAccountObjectType> {
    return this.bankAccountService.create({name, iban})
  }

  @Mutation(() => BankAccountObjectType, {nullable: true})
  async updateAccount(
    @Args('uuid', {type: () => ID}) uuid: string,
    @Args('name') name: string,
    @Args('iban') iban: string
  ): Promise<BankAccountObjectType | null> {
    await this.bankAccountService.update(uuid, {name, iban})
    return this.bankAccountService.findOne(uuid)
  }

  @Mutation(() => Boolean)
  async deleteAccount(@Args('uuid', {type: () => ID}) uuid: string) {
    await this.bankAccountService.remove(uuid)
    return true
  }
}
