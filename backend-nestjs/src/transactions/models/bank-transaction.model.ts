import {Field, ID, Int, ObjectType} from '@nestjs/graphql'
import {BankAccountObjectType} from '../../bank-accounts/models/bank-account.model'
import {PayeeObjectType} from '../../payees/models/payee.model'
import {CategoryObjectType} from '../../categories/models/category.model'

@ObjectType()
export class BankTransactionObjectType {
  @Field(() => ID)
  uuid!: string

  @Field()
  date!: string

  @Field(() => String, {nullable: true})
  time!: string | null

  @Field(() => Int)
  amount!: number

  @Field(() => BankAccountObjectType)
  bankAccount!: BankAccountObjectType

  @Field(() => PayeeObjectType, {nullable: true})
  payee!: PayeeObjectType | null

  @Field(() => [BankTransactionItemObjectType])
  items!: BankTransactionItemObjectType[]
}

@ObjectType()
export class BankTransactionItemObjectType {
  @Field(() => ID)
  uuid!: string

  @Field(() => Int)
  amount!: number

  @Field(() => CategoryObjectType)
  category!: CategoryObjectType

  @Field(() => Boolean)
  isCredit!: boolean

  @Field(() => BankTransactionItemObjectType, {nullable: true})
  reimburse!: BankTransactionItemObjectType | null
}
