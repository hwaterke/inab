import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class BankAccountObjectType {
  @Field(() => ID)
  uuid!: string

  @Field()
  name!: string
}
