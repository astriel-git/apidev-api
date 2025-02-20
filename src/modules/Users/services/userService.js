// src/modules/Users/services/userService.js
import { user } from '../data-access/userRepo.js'
import { UnauthorizedError, BadRequestError, ConstraintError } from '../../../core/errors/customErrors.js'

export const loginUser = async (dados) => {
  if (!dados.email || !dados.senha) {
    throw new BadRequestError('Email and senha are required.')
  }

  const result = await user.login(dados)

  if (!result.login) {
    throw new UnauthorizedError('Invalid credentials.')
  }

  return result
}

export const logoutUser = async () => {
  const result = await user.logout()

  if (!result.login) {
    throw new UnauthorizedError('Invalid credentials.')
  }

  return result
}

export const registerUser = async (dados) => {
  if (!dados.nome || !dados.email || !dados.senha) {
    throw new BadRequestError('Name, email, and senha are required.')
  }

  try {
    const newUser = await user.register(dados)
    if (!newUser) {
      throw new Error('User could not be registered.')
    }
    return newUser
  } catch (error) {
    if (error.details && error.details.code === 'P2002') {
      const uniqueConstraint = error.details.meta.target
      throw new ConstraintError(uniqueConstraint)
    }
    throw error
  }
}
