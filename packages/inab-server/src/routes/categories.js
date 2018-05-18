import expressPromiseRouter from 'express-promise-router'
import {genericController} from '../controllers/genericController'
import {Category} from '../database/entities/Category'
import {validateBody} from '../middlewares/validateBody'
import {validateEntityByUuidAndUser} from '../middlewares/validateEntityByUuidAndUser'
import {categorySchema} from '../schemas/category'

export const categoryRouter = () => {
  const controller = genericController(Category)

  const router = expressPromiseRouter()

  router.get('/', controller.getAll)

  router.get('/:uuid', validateEntityByUuidAndUser(Category), controller.getOne)

  router.post('/', validateBody(categorySchema), controller.create)

  router.patch(
    '/:uuid',
    validateBody(categorySchema),
    validateEntityByUuidAndUser(Category),
    controller.update
  )

  router.delete(
    '/:uuid',
    validateEntityByUuidAndUser(Category),
    controller.remove
  )

  return router
}
