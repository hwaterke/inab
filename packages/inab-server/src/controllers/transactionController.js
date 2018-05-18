import {getManager, getRepository} from 'typeorm'
import {Subtransaction} from '../database/entities/Subtransaction'
import {Transaction} from '../database/entities/Transaction'
import {TransactionTag} from '../database/entities/TransactionTag'

export const transactionController = {
  update: async (req, res) => {
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.delete(Subtransaction, {
        transaction: {uuid: req.value.params.uuid},
      })

      await transactionalEntityManager.delete(TransactionTag, {
        transaction: {uuid: req.value.params.uuid},
      })

      await transactionalEntityManager.save(Transaction, {
        ...req.value.body,
        uuid: req.value.params.uuid,
      })
    })

    const updatedEntity = await getRepository(Transaction).findOne(
      req.value.params.uuid
    )
    return res.json(updatedEntity)
  },

  remove: async (req, res) => {
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.delete(Subtransaction, {
        transaction: {uuid: req.value.params.uuid},
      })

      await transactionalEntityManager.delete(TransactionTag, {
        transaction: {uuid: req.value.params.uuid},
      })

      await transactionalEntityManager.remove(Transaction, {
        uuid: req.value.existingEntity.uuid,
      })
    })

    res.status(204).end()
  },
}
