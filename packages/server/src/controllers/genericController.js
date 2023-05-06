import {getRepository} from 'typeorm'

export const genericController = (model) => {
  const repository = getRepository(model)

  return {
    getAll: async (req, res) => {
      const entities = await repository.find({user: {uuid: req.user.uuid}})
      res.json(entities)
    },

    getOne: async (req, res) => {
      const entity = req.value.existingEntity
      return res.json(entity)
    },

    create: async (req, res) => {
      const entity = repository.create({
        ...req.value.body,
        user: {uuid: req.user.uuid},
      })
      const result = await repository.save(entity)

      const createdEntity = await repository.findOne(result.uuid)
      res.status(201).json(createdEntity)
    },

    update: async (req, res) => {
      const bodyEntity = req.value.body

      const entityToSave = {
        ...bodyEntity,
        uuid: req.value.params.uuid,
      }

      await repository.save(entityToSave)

      const updatedEntity = await repository.findOne(req.value.params.uuid)
      return res.json(updatedEntity)
    },

    remove: async (req, res) => {
      await repository.remove({uuid: req.value.existingEntity.uuid})
      res.status(204).end()
    },
  }
}
