import Joi from 'joi'
import {JoiDateString, JoiString, JoiUuid} from '../utils/joi'

export const categorySchema = {
  name: JoiString.required(),
  priority: Joi.number()
    .integer()
    .min(0)
    .required(),
  category_group_uuid: JoiUuid.required(),

  // Goal
  goal_type: Joi.valid('tb', 'tbd', 'mf', null),

  // TODO Must be there if goal_creation_month if present
  // TODO Must be the first of the month
  goal_creation_month: JoiDateString.allow(null),

  // TODO Must be > 0 if goal_type is tb or tbd
  // TODO Must be 0 if goal_type is mf
  target_balance: Joi.number()
    .integer()
    .min(0),

  // TODO Must be there if goal_type is tbd and null otherwise
  target_balance_month: JoiDateString.allow(null),

  // TODO Must be > 0 if goal_type is mf and 0 otherwise
  monthly_funding: Joi.number()
    .integer()
    .min(0),
}
