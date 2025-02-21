// src/modules/Users/services/userService.js
import { user } from '../data-access/userRepo.js'
import { UnauthorizedError, BadRequestError, ConstraintError } from '../../../core/errors/customErrors.js'

export const loginUser = async (dados) => {
  console.log(dados)
  if (!dados.identificador || !dados.senha) {
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

export const recoverPassword = async (dados) => {
  if (!dados.email || !dados.cpf) {
    throw new BadRequestError('Email and CPF are required.')
  }

  try {
    // This will find the user, generate a token, update the DB record, and log the token.
    const result = await user.recoverPassword(dados)
    console.log(`Simulated email: Sending recovery token to ${dados.email}`)
    console.log(`Recovery Token: ${result.recoveryToken}`)
    return { message: 'Recovery email sent successfully.' }
  } catch (error) {
    // Optionally transform the error if the user is not found.
    if (error.message === 'User not found.') {
      throw new UnauthorizedError('User not found.')
    }
    throw error
  }
}

export const resetPassword = async (dados) => {
  if (!dados.token || !dados.newPassword) {
    throw new BadRequestError('Token and new password are required.')
  }
  // Call the repository function to perform the reset
  return await user.resetPassword(dados.token, dados.newPassword)
}
