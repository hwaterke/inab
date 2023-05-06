import Joi from 'joi'
import {JoiString} from '../utils/joi'

export const categoryGroupSchema = {
  name: JoiString.required(),
  priority: Joi.number().integer().min(0).required(),
}
