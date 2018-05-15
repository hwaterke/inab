import jwt, {UnauthorizedError} from 'express-jwt'
import {getRepository} from 'typeorm'
import {User} from '../database/entities/User'
import {tokenSecret} from '../utils/jwt'

export const validateToken = [
  jwt({secret: tokenSecret}),

  async (req, res, next) => {
    const repository = getRepository(User)

    try {
      req.user = await repository.findOne(req.user)

      if (!req.user) {
        return next(
          new UnauthorizedError('user-not-found', {
            message: 'user not found',
          })
        )
      }
      next()
    } catch (err) {
      next(err)
    }
  },
]
