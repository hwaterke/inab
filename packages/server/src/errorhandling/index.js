/* eslint-disable no-unused-vars */
import boom from 'boom'

export const catchNotFound = (req, res, next) => {
  const boomed = boom.notFound()
  res.status(boomed.output.statusCode).json(boomed.output.payload)
}

export const tokenErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    const boomed = boom.unauthorized(err.message)
    return res.status(boomed.output.statusCode).json(boomed.output.payload)
  } else {
    next(err)
  }
}

export const errorHandler = (err, req, res, next) => {
  const boomed = boom.badImplementation(err.message)
  res.status(boomed.output.statusCode).json(boomed.output.payload)
  // eslint-disable-next-line no-console
  console.error(err)
}
