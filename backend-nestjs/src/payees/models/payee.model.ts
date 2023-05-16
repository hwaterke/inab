import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class PayeeObjectType {
  @Field(() => ID)
  uuid!: string

  @Field(() => String)
  name!: string
}
