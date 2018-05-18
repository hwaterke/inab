import Joi from 'joi'
import {JoiUuid} from '../utils/joi'

export const budgetItemSchema = {
  month: Joi.date()
    .iso()
    .required(),

  category_uuid: JoiUuid.required(),

  amount: Joi.number()
    .integer()
    .invalid(0)
    .required(),
}
