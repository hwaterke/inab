import expressPromiseRouter from 'express-promise-router'
import {genericController} from '../controllers/genericController'
import {payeeController} from '../controllers/payeeController'
import {Payee} from '../database/entities/Payee'
import {validateBody} from '../middlewares/validateBody'
import {validateEntityByUuidAndUser} from '../middlewares/validateEntityByUuidAndUser'
import {payeeSchema} from '../schemas/payee'

export const payeeRouter = () => {
  const controller = genericController(Payee)

  const router = expressPromiseRouter()

  router.get('/', controller.getAll)

  router.get('/:uuid', validateEntityByUuidAndUser(Payee), controller.getOne)

  router.post('/', validateBody(payeeSchema), controller.create)

  router.patch(
    '/:uuid',
    validateBody(payeeSchema),
    validateEntityByUuidAndUser(Payee),
    payeeController.update
  )

  router.delete(
    '/:uuid',
    validateEntityByUuidAndUser(Payee),
    payeeController.remove
  )

  return router
}
