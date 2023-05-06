import Joi from 'joi'
import {JoiString} from '../utils/joi'

const locationSchema = {
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
}

export const payeeSchema = {
  name: JoiString.required(),
  locations: Joi.array().items(locationSchema).required(),
}
