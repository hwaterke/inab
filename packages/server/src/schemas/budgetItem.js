import Joi from 'joi'
import {JoiUuid} from '../utils/joi'

export const budgetItemSchema = {
  // TODO Must be the first of the month
  month: Joi.date()
    .iso()
    .required(),

  category_uuid: JoiUuid.required(),

  amount: Joi.number()
    .integer()
    .invalid(0)
    .required(),
}
