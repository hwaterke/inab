import {Field, InputType, Int} from '@nestjs/graphql'

@InputType()
export class PaginationInput {
  @Field(() => Int)
  page!: number

  @Field(() => Int)
  pageSize!: number
}
