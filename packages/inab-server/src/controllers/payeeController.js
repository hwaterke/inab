import {getManager, getRepository} from 'typeorm'
import {Location} from '../database/entities/Location'
import {Payee} from '../database/entities/Payee'

export const payeeController = {
  update: async (req, res) => {
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.delete(Location, {
        payee: {uuid: req.value.params.uuid},
      })

      await transactionalEntityManager.save(Payee, {
        ...req.value.body,
        uuid: req.value.params.uuid,
      })
    })

    const updatedEntity = await getRepository(Payee).findOne(
      req.value.params.uuid
    )
    return res.json(updatedEntity)
  },

  remove: async (req, res) => {
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.delete(Location, {
        payee: {uuid: req.value.params.uuid},
      })

      await transactionalEntityManager.remove(Payee, {
        uuid: req.value.existingEntity.uuid,
      })
    })

    res.status(204).end()
  },
}
