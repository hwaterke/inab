import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CategoryGroup} from './entities/category-group.entity'
import {Category} from './entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryGroup)
    private categoryGroupRepository: Repository<CategoryGroup>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  findAllGroups() {
    return this.categoryGroupRepository.find({
      relations: {
        categories: true,
      },
    })
  }

  findOneGroup(uuid: string) {
    return this.categoryGroupRepository.findOneOrFail({
      where: {uuid},
      relations: {
        categories: true,
      },
    })
  }

  async upsertGroup(payload: {name: string}) {
    const existingGroup = await this.categoryGroupRepository.findOne({
      where: {name: payload.name},
    })

    if (existingGroup) {
      return existingGroup
    }

    return this.createGroup(payload)
  }

  async upsert(payload: {name: string; categoryGroupUuid: string}) {
    const existingCategory = await this.categoryRepository.findOne({
      where: {name: payload.name, categoryGroupUuid: payload.categoryGroupUuid},
    })

    if (existingCategory) {
      return existingCategory
    }

    return this.create(payload)
  }

  createGroup(payload: {name: string}) {
    return this.categoryGroupRepository.save(payload)
  }

  updateGroup(uuid: string, payload: {name: string}) {
    return this.categoryGroupRepository.update(uuid, payload)
  }

  removeGroup(uuid: string) {
    return this.categoryGroupRepository.delete(uuid)
  }

  findAll() {
    return this.categoryRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  findOne(uuid: string) {
    return this.categoryRepository.findOneOrFail({where: {uuid}})
  }

  create(payload: {name: string; categoryGroupUuid: string}) {
    return this.categoryRepository.save(payload)
  }

  update(uuid: string, payload: {name: string; categoryGroupUuid: string}) {
    return this.categoryRepository.update(uuid, payload)
  }

  remove(uuid: string) {
    return this.categoryRepository.delete(uuid)
  }
}
