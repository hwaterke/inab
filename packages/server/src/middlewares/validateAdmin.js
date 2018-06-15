import {UnauthorizedError} from 'express-jwt'
import {validateToken} from './validateToken'

export const validateAdmin = [
  validateToken,

  async (req, res, next) => {
    if (req.user.is_admin) {
      return next()
    }

    return next(
      new UnauthorizedError('not_admin', {
        message: 'administration role required',
      })
    )
  },
]
