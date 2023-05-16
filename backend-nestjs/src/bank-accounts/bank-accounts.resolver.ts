import {BankAccountObjectType} from './models/bank-account.model'
import {ID, Query, Resolver, Args} from '@nestjs/graphql'
import {BankAccountService} from './bank-account.service'

@Resolver(() => BankAccountObjectType)
export class BankAccountsResolver {
  constructor(private bankAccountService: BankAccountService) {}

  @Query(() => [BankAccountObjectType])
  async accounts() {
    return this.bankAccountService.findAll()
  }

  @Query(() => BankAccountObjectType)
  async author(@Args('uuid', {type: () => ID}) uuid: string) {
    return this.bankAccountService.findOne(uuid)
  }
}
