import expressPromiseRouter from 'express-promise-router'
import {genericController} from '../controllers/genericController'
import {CategoryGroup} from '../database/entities/CategoryGroup'
import {validateBody} from '../middlewares/validateBody'
import {validateEntityByUuidAndUser} from '../middlewares/validateEntityByUuidAndUser'
import {categoryGroupSchema} from '../schemas/categoryGroup'

export const categoryGroupRouter = () => {
  const controller = genericController(CategoryGroup)

  const router = expressPromiseRouter()

  router.get('/', controller.getAll)

  router.get(
    '/:uuid',
    validateEntityByUuidAndUser(CategoryGroup),
    controller.getOne
  )

  router.post('/', validateBody(categoryGroupSchema), controller.create)

  router.patch(
    '/:uuid',
    validateBody(categoryGroupSchema),
    validateEntityByUuidAndUser(CategoryGroup),
    controller.update
  )

  router.delete(
    '/:uuid',
    validateEntityByUuidAndUser(CategoryGroup),
    controller.remove
  )

  return router
}
