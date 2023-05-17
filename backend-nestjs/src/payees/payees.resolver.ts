import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql'
import {PayeeObjectType} from './models/payee.model'
import {PayeeService} from './payee.service'

@Resolver(() => PayeeObjectType)
export class PayeesResolver {
  constructor(private payeeService: PayeeService) {}

  @Query(() => [PayeeObjectType])
  async payees(): Promise<PayeeObjectType[]> {
    return this.payeeService.findAll()
  }

  @Mutation(() => PayeeObjectType)
  async createPayee(@Args('name') name: string): Promise<PayeeObjectType> {
    return this.payeeService.create({name})
  }

  @Mutation(() => PayeeObjectType, {nullable: true})
  async updatePayee(
    @Args('uuid', {type: () => ID}) uuid: string,
    @Args('name') name: string
  ): Promise<PayeeObjectType | null> {
    await this.payeeService.update(uuid, {name})
    return this.payeeService.findOne(uuid)
  }

  @Mutation(() => Boolean)
  async deletePayee(@Args('uuid', {type: () => ID}) uuid: string) {
    await this.payeeService.remove(uuid)
    return true
  }
}
