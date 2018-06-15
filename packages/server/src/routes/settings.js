import expressPromiseRouter from 'express-promise-router'
import {SystemSettingController} from '../controllers/SystemSettingController'
import {validateAdmin} from '../middlewares/validateAdmin'
import {validateBody} from '../middlewares/validateBody'
import {nameSchema, validateParams} from '../middlewares/validateParams'
import {systemSettingSchema} from '../schemas/settings'

export const systemSettingRouter = () => {
  const router = expressPromiseRouter()

  router.get('/:name', validateParams(nameSchema), SystemSettingController.read)

  router.put(
    '/:name',
    validateAdmin,
    validateParams(nameSchema),
    validateBody(systemSettingSchema),
    SystemSettingController.write
  )

  return router
}
