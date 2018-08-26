import bcrypt from 'bcrypt'
import boom from 'boom'
import {path} from 'ramda'
import {getRepository} from 'typeorm'
import {ErrorMessages} from '../constants/ErrorMessages'
import {SystemSetting} from '../database/entities/SystemSetting'
import {User} from '../database/entities/User'
import {createToken} from '../utils/jwt'

async function validatePassword({uuid, plainTextPassword}) {
  const user = await getRepository(User)
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.uuid = :uuid', {uuid})
    .getOne()

  if (!user || !user.password) {
    return false
  }

  return bcrypt.compare(plainTextPassword, user.password)
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

    const user = await repository.findOne(result.uuid)

    res
      .append('Authorization', `Bearer ${createToken(result.uuid)}`)
      .status(201)
      .json(user)
  },

  login: async (req, res) => {
    const repository = getRepository(User)

    const user = await repository.findOne({email: req.value.body.email})

    if (user && (await validatePassword(user.uuid, req.value.body.password))) {
      return res
        .append('Authorization', `Bearer ${createToken(user.uuid)}`)
        .status(200)
        .json(user)
    }

    const boomed = boom.unauthorized()
    res.status(boomed.output.statusCode).json(boomed.output.payload)
  },
}
