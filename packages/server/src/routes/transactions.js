import expressPromiseRouter from 'express-promise-router'
import {genericController} from '../controllers/genericController'
import {transactionController} from '../controllers/transactionController'
import {Transaction} from '../database/entities/Transaction'
import {validateBody} from '../middlewares/validateBody'
import {validateEntityByUuidAndUser} from '../middlewares/validateEntityByUuidAndUser'
import {
  transactionSchema,
  transactionUpdateSchema,
} from '../schemas/transaction'

export const transactionRouter = () => {
  const controller = genericController(Transaction)

  const router = expressPromiseRouter()

  router.get('/', controller.getAll)

  router.get(
    '/:uuid',
    validateEntityByUuidAndUser(Transaction),
    controller.getOne
  )

  router.post('/', validateBody(transactionSchema), controller.create)

  router.patch(
    '/:uuid',
    validateBody(transactionUpdateSchema),
    validateEntityByUuidAndUser(Transaction),
    transactionController.update
  )

  router.delete(
    '/:uuid',
    validateEntityByUuidAndUser(Transaction),
    transactionController.remove
  )

  return router
}
