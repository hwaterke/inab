import expressPromiseRouter from 'express-promise-router'
import {genericController} from '../controllers/genericController'
import {Account} from '../database/entities/Account'
import {validateBody} from '../middlewares/validateBody'
import {validateEntityByUuidAndUser} from '../middlewares/validateEntityByUuidAndUser'
import {accountSchema} from '../schemas/account'

export const accountRouter = () => {
  const controller = genericController(Account)

  const router = expressPromiseRouter()

  router.get('/', controller.getAll)

  router.get('/:uuid', validateEntityByUuidAndUser(Account), controller.getOne)

  router.post('/', validateBody(accountSchema), controller.create)

  router.patch(
    '/:uuid',
    validateBody(accountSchema),
    validateEntityByUuidAndUser(Account),
    controller.update
  )

  router.delete(
    '/:uuid',
    validateEntityByUuidAndUser(Account),
    controller.remove
  )

  return router
}
