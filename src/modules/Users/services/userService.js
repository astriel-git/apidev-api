// src/modules/Users/services/userService.js
import { user } from '../data-access/userRepo.js'
import { UnauthorizedError, BadRequestError } from '../../../core/errors/index.js'

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

export const registerUser = async (dados) => {
  if (!dados.nome || !dados.email || !dados.senha) {
    throw new BadRequestError('Name, email, and senha are required.')
  }

  const newUser = await user.register(dados)
  if (!newUser) {
    throw new Error('User could not be registered.')
  }

  return newUser
}
