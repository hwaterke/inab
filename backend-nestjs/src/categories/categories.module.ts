import {Module} from '@nestjs/common'
import {CategoryService} from './category.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Category} from './entities/category.entity'
import {CategoryGroup} from './entities/category-group.entity'
import {CategoriesResolver} from './categories.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryGroup])],
  providers: [CategoryService, CategoriesResolver],
  exports: [CategoryService],
})
export class CategoriesModule {}
