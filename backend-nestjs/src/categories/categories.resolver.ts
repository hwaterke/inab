import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql'
import {
  CategoryGroupObjectType,
  CategoryObjectType,
} from './models/category.model'
import {CategoryService} from './category.service'

@Resolver()
export class CategoriesResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [CategoryGroupObjectType])
  async categoryGroups(): Promise<CategoryGroupObjectType[]> {
    return this.categoryService.findAllGroups()
  }

  @Query(() => CategoryGroupObjectType)
  async categoryGroup(
    @Args('uuid', {type: () => ID}) uuid: string
  ): Promise<CategoryGroupObjectType> {
    return this.categoryService.findOneGroup(uuid)
  }

  @Mutation(() => CategoryGroupObjectType)
  async createCategoryGroup(
    @Args('name') name: string
  ): Promise<CategoryGroupObjectType> {
    const result = await this.categoryService.createGroup({name})
    return this.categoryService.findOneGroup(result.uuid)
  }

  @Mutation(() => CategoryGroupObjectType, {nullable: true})
  async updateCategoryGroup(
    @Args('uuid', {type: () => ID}) uuid: string,
    @Args('name') name: string
  ): Promise<CategoryGroupObjectType | null> {
    await this.categoryService.updateGroup(uuid, {name})
    return this.categoryService.findOneGroup(uuid)
  }

  @Mutation(() => Boolean)
  async deleteCategoryGroup(@Args('uuid', {type: () => ID}) uuid: string) {
    await this.categoryService.removeGroup(uuid)
    return true
  }

  @Query(() => [CategoryObjectType])
  async categories(): Promise<CategoryObjectType[]> {
    return this.categoryService.findAll()
  }

  @Query(() => CategoryObjectType)
  async category(
    @Args('uuid', {type: () => ID}) uuid: string
  ): Promise<CategoryObjectType> {
    return this.categoryService.findOne(uuid)
  }

  @Mutation(() => CategoryObjectType)
  async createCategory(
    @Args('name') name: string,
    @Args('categoryGroupUuid', {type: () => ID}) categoryGroupUuid: string
  ): Promise<CategoryObjectType> {
    return this.categoryService.create({name, categoryGroupUuid})
  }

  @Mutation(() => CategoryObjectType)
  async updateCategory(
    @Args('uuid', {type: () => ID}) uuid: string,
    @Args('name') name: string,
    @Args('categoryGroupUuid', {type: () => ID}) categoryGroupUuid: string
  ): Promise<CategoryObjectType> {
    await this.categoryService.update(uuid, {name, categoryGroupUuid})
    return this.categoryService.findOne(uuid)
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Args('uuid', {type: () => ID}) uuid: string) {
    await this.categoryService.remove(uuid)
    return true
  }
}
