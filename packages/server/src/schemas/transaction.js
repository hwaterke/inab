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

  // TODO Must be null if transfer_account_uuid is not null
  payee_uuid: JoiUuid.allow(null),

  description: JoiString.allow(null),

  // TODO Must be > 0 if type is to_be_budgeted
  amount: Joi.number()
    .integer()
    .required(),

  type: Joi.valid('regular', 'to_be_budgeted', 'split').required(),

  // TODO Must be null if transfer_account_uuid is not null
  // TODO Must be null if type is to_be_budgeted or split
  category_uuid: JoiUuid.allow(null),

  account_uuid: JoiUuid.required(),

  // TODO Must be different than account_uuid
  transfer_account_uuid: JoiUuid.allow(null),

  subtransactions: Joi.array()
    .items(subtransactionSchema)
    .required(),

  tags: Joi.array()
    .items(tagSchema)
    .required(),

  cleared_at: Joi.date().iso(),
}
