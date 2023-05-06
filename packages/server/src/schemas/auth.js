import Joi from 'joi'

const emailSchema = Joi.string().trim().max(200).email().required()

const passwordSchema = Joi.string().trim().min(8).max(200).required()

export const emailPasswordSchema = {
  email: emailSchema,
  password: passwordSchema,
}
