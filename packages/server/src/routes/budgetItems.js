import expressPromiseRouter from 'express-promise-router'
import {genericController} from '../controllers/genericController'
import {BudgetItem} from '../database/entities/BudgetItem'
import {validateBody} from '../middlewares/validateBody'
import {validateEntityByUuidAndUser} from '../middlewares/validateEntityByUuidAndUser'
import {budgetItemSchema} from '../schemas/budgetItem'

export const budgetItemRouter = () => {
  const controller = genericController(BudgetItem)

  const router = expressPromiseRouter()

  router.get('/', controller.getAll)

  router.get(
    '/:uuid',
    validateEntityByUuidAndUser(BudgetItem),
    controller.getOne
  )

  router.post('/', validateBody(budgetItemSchema), controller.create)

  router.patch(
    '/:uuid',
    validateBody(budgetItemSchema),
    validateEntityByUuidAndUser(BudgetItem),
    controller.update
  )

  router.delete(
    '/:uuid',
    validateEntityByUuidAndUser(BudgetItem),
    controller.remove
  )

  return router
}
