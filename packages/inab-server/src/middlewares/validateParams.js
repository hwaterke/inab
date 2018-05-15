import boom from 'boom'
import Joi from 'joi'

export const uuidSchema = {
  uuid: Joi.string().uuid({version: 'uuidv4'}),
}

// Validates the params of the request against a Joi Schema
export function validateParams(schema) {
  return (req, res, next) => {
    const result = Joi.validate(req.params, schema, {stripUnknown: true})

    if (result.error) {
      const boomed = boom.badRequest(result.error)
      return res.status(boomed.output.statusCode).json(boomed.output.payload)
    }

    if (!req.value) {
      req.value = {}
    }

    req.value.params = {
      ...req.value.params,
      ...result.value,
    }

    next()
  }
}
