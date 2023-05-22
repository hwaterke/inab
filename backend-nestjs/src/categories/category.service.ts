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
