import Joi from 'joi'

export const JoiString = Joi.string()
  .trim()
  .max(500)
