import Joi from 'joi'
import {JoiMonthString, JoiUuid} from '../utils/joi'

export const budgetItemSchema = {
  month: JoiMonthString.required(),

  category_uuid: JoiUuid.required(),

  amount: Joi.number().integer().invalid(0).required(),
}
