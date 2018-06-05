import boom from 'boom'
import {getRepository} from 'typeorm'
import {uuidSchema, validateParams} from './validateParams'

// Retrieves an existing entity by the uuid specified
export function validateEntityByUuidAndUser(model) {
  return [
    validateParams(uuidSchema),

    async (req, res, next) => {
      const repository = getRepository(model)

      try {
        const entity = await repository.findOne({
          uuid: req.value.params.uuid,
          user: {uuid: req.user.uuid},
        })

        if (!entity) {
          const boomed = boom.notFound()
          return res
            .status(boomed.output.statusCode)
            .json(boomed.output.payload)
        }

        if (!req.value) {
          req.value = {}
        }

        req.value.existingEntity = entity
        next()
      } catch (err) {
        next(err)
      }
    },
  ]
}
