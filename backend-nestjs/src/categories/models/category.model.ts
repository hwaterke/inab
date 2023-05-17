import {Field, ID, ObjectType} from '@nestjs/graphql'

@ObjectType()
export class CategoryObjectType {
  @Field(() => ID)
  uuid!: string

  @Field(() => String)
  name!: string

  @Field(() => ID)
  categoryGroupUuid!: string
}

@ObjectType()
export class CategoryGroupObjectType {
  @Field(() => ID)
  uuid!: string

  @Field(() => String)
  name!: string

  @Field(() => [CategoryObjectType])
  categories!: CategoryObjectType[]
}
