import {JoiString} from '../utils/joi'

export const systemSettingSchema = {
  value: JoiString.allow(null).required(),
}
