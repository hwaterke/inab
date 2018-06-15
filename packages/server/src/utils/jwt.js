import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const tokenSecret =
  process.env.TOKEN_SECRET || crypto.randomBytes(64).toString('hex')

export const createToken = userUuid => {
  return jwt.sign(userUuid, tokenSecret)
}
