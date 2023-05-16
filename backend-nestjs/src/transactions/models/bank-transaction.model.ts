import {Field, ID, Int, ObjectType} from '@nestjs/graphql'
import {BankAccountObjectType} from '../../bank-accounts/models/bank-account.model'
import {CategoryObjectType} from '../../categories/models/category.model'
import {PayeeObjectType} from '../../payees/models/payee.model'

@ObjectType()
export class BankTransactionObjectType {
  @Field(() => ID)
  uuid!: string

  @Field()
  date!: string

  @Field(() => String, {nullable: true})
  time?: string | null

  @Field(() => Int)
  amount!: number

  @Field(() => BankAccountObjectType)
  bankAccount!: BankAccountObjectType

  @Field(() => CategoryObjectType, {nullable: true})
  category?: CategoryObjectType

  @Field(() => PayeeObjectType, {nullable: true})
  payee!: PayeeObjectType
}
