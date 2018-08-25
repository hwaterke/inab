import Joi from 'joi'

export const JoiString = Joi.string()
  .trim()
  .max(500)

export const JoiUuid = Joi.string().uuid({version: 'uuidv4'})

export const JoiDateString = JoiString.regex(/^\d{4}-\d{2}-\d{2}$/)

export const JoiMonthString = JoiString.regex(/^\d{4}-\d{2}-01$/)
