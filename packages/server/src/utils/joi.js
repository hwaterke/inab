import Joi from 'joi'

export const JoiString = Joi.string()
  .trim()
  .max(500)

export const JoiUuid = Joi.string().uuid({version: 'uuidv4'})
