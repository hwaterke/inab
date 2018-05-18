import bcrypt from 'bcrypt'
import boom from 'boom'
import {path} from 'ramda'
import {getRepository} from 'typeorm'
import {ErrorMessages} from '../constants/ErrorMessages'
import {SystemSetting} from '../database/entities/SystemSetting'
import {User} from '../database/entities/User'
import {createToken} from '../utils/jwt'

function userPresenter(user) {
  // Make sure password does not leak out
  return {...user, password: undefined}
}

export const AuthController = {
  register: async (req, res) => {
    const repository = getRepository(User)

    // Make sure the email is not used yet.
    const existingUser = await repository.findOne({
      where: {email: req.value.body.email},
    })

    if (existingUser) {
      const boomed = boom.badRequest(ErrorMessages.EMAIL_USED)
      return res.status(boomed.output.statusCode).json(boomed.output.payload)
    }

    // Count the total number of existing user
    const userCount = await repository.count()

    // Check if registration are enabled
    const registrationSetting = await getRepository(SystemSetting).findOne({
      name: 'registration',
    })

    if (userCount > 0 && path(['value'], registrationSetting) !== '1') {
      const boomed = boom.unauthorized(ErrorMessages.REGISTRATION_DISABLED)
      return res.status(boomed.output.statusCode).json(boomed.output.payload)
    }

    const passwordHash = await bcrypt.hash(req.value.body.password, 10)
    const entity = repository.create({
      ...req.value.body,
      password: passwordHash,
      // Only the first user to register is an admin
      is_admin: userCount === 0,
    })
    const result = await repository.save(entity)

    res
      .append('Authorization', `Bearer ${createToken(result.uuid)}`)
      .status(201)
      .json(userPresenter(result))
  },

  login: async (req, res) => {
    const repository = getRepository(User)

    const user = await repository.findOne({
      where: {email: req.value.body.email},
    })

    if (user && (await user.validatePassword(req.value.body.password))) {
      return res
        .append('Authorization', `Bearer ${createToken(user.uuid)}`)
        .status(200)
        .json(userPresenter(user))
    }

    const boomed = boom.unauthorized()
    res.status(boomed.output.statusCode).json(boomed.output.payload)
  },
}
