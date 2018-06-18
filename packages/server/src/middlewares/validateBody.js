import boom from 'boom'
import Joi from 'joi'

// Validates the body of the request against a Joi Schema
export function validateBody(schema) {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema, {
      stripUnknown: {objects: true},
    })

    if (result.error) {
      const boomed = boom.badRequest(result.error)
      return res.status(boomed.output.statusCode).json(boomed.output.payload)
    }

    if (!req.value) {
      req.value = {}
    }

    req.value.body = result.value
    next()
  }
}
