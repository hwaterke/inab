import {Field, ID, InputType, Int, ObjectType} from '@nestjs/graphql'
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

  @Field(() => String, {nullable: true})
  hash!: string | null

  @Field(() => String, {nullable: true})
  importDetails!: string | null
}

@ObjectType()
export class BankTransactionListObjectType {
  @Field(() => [BankTransactionObjectType])
  items!: BankTransactionObjectType[]

  @Field(() => Int)
  totalCount!: number
}

@ObjectType()
export class BankTransactionItemObjectType {
  @Field(() => ID)
  uuid!: string

  @Field(() => Int)
  amount!: number

  @Field(() => CategoryObjectType, {nullable: true})
  category!: CategoryObjectType | null

  @Field(() => Boolean)
  isIncome!: boolean

  @Field(() => Boolean)
  isCredit!: boolean

  @Field(() => BankTransactionItemObjectType, {nullable: true})
  reimburse!: BankTransactionItemObjectType | null

  @Field(() => [BankTransactionItemObjectType])
  reimbursedBy!: BankTransactionItemObjectType[]

  @Field(() => BankTransactionObjectType)
  transaction!: BankTransactionObjectType

  @Field(() => String, {nullable: true})
  description!: string | null
}

@InputType()
export class BankTransactionItemInputType {
  @Field(() => Int)
  amount!: number

  @Field(() => ID, {nullable: true})
  categoryUuid!: string | null

  @Field(() => Boolean)
  isIncome!: boolean

  @Field(() => Boolean)
  isCredit!: boolean

  @Field(() => ID, {nullable: true})
  reimburseUuid!: string | null

  @Field(() => String, {nullable: true})
  description!: string | null
}
