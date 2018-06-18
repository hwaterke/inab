import expressPromiseRouter from 'express-promise-router'
import {AuthController} from '../controllers/AuthController'
import {validateBody} from '../middlewares/validateBody'
import {emailPasswordSchema} from '../schemas/auth'

export const authRouter = () => {
  const router = expressPromiseRouter()

  router.post(
    '/register',
    validateBody(emailPasswordSchema),
    AuthController.register
  )

  router.post('/login', validateBody(emailPasswordSchema), AuthController.login)

  return router
}
