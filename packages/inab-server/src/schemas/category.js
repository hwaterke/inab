import Joi from 'joi'
import {JoiString, JoiUuid} from '../utils/joi'

export const categorySchema = {
  name: JoiString.required(),
  priority: Joi.number()
    .integer()
    .min(0)
    .required(),
  category_group_uuid: JoiUuid.required(),

  // Goal
  goal_type: JoiString.valid('tb', 'tbd', 'mf', null),
  goal_creation_month: Joi.date()
    .iso()
    .allow(null),
  target_balance: Joi.number()
    .integer()
    .min(0),
  target_balance_month: Joi.date()
    .iso()
    .allow(null),
  monthly_funding: Joi.number()
    .integer()
    .min(0),
}
