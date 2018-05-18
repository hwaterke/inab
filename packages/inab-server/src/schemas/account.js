import {JoiString} from '../utils/joi'

export const accountSchema = {
  name: JoiString.required(),
}
