import {getRepository} from 'typeorm/index'
import {SystemSetting} from '../database/entities/SystemSetting'

export const SystemSettingController = {
  read: async (req, res) => {
    const repository = getRepository(SystemSetting)
    const setting = await repository.findOne({name: req.value.params.name})
    res.json(setting || null)
  },

  write: async (req, res) => {
    const repository = getRepository(SystemSetting)

    const setting = await repository.save({
      name: req.value.params.name,
      value: req.value.body.value,
    })

    res.json(setting)
  },
}
