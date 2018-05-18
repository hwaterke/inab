import Joi from 'joi'
import {JoiString, JoiUuid} from '../utils/joi'

const subtransactionSchema = {
  description: JoiString,
  amount: Joi.number()
    .integer()
    .required(),
  category_uuid: JoiUuid.allow(null),
}

const tagSchema = {
  name: JoiString.required(),
}

export const transactionSchema = {
  date: Joi.date()
    .iso()
    .required(),
  time: JoiString,
  payee_uuid: JoiUuid.allow(null),
  description: JoiString.allow(null),
  amount: Joi.number()
    .integer()
    .required(),

  type: Joi.valid('regular', 'to_be_budgeted', 'split'),

  category_uuid: JoiUuid.allow(null),
  account_uuid: JoiUuid.required(),
  transfer_account_uuid: JoiUuid.allow(null),
  subtransactions: Joi.array()
    .items(subtransactionSchema)
    .required(),

  tags: Joi.array()
    .items(tagSchema)
    .required(),

  cleared_at: Joi.date().iso(),
}
