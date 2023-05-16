import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class CategoryObjectType {
  @Field(() => ID)
  uuid!: string

  @Field(() => String)
  name!: string
}
