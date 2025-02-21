// src/modules/Users/data-access/userRepo.js
import prisma from '../../../config/prismaClient.js'
import bcrypt from 'bcrypt'
import { PrismaClientError, UnauthorizedError } from '../../../core/errors/customErrors.js'
import { Prisma } from '@prisma/client'
import { createToken } from '../../../core/auth/jwt.js'
import crypto from 'crypto'

const SALT_ROUNDS = 10

export const user = {
  /**
   * Attempts to find a user by credentials.
   * @param {Object} dados - Login data.
   */
  async login (dados) {
    try {
      const identifier = dados.identificador // Changed here
      const login = await prisma.user.findFirst({
        select: {
          userid: true,
          role: true,
          nome: true,
          email: true,
          senha: true,
          cpf: true
        },
        where: {
          OR: [
            { email: identifier },
            { cpf: identifier }
          ]
        }
      })

      // If no user is found or password doesn't match, handle error
      if (!login || !(await bcrypt.compare(dados.senha, login.senha))) {
        throw new Error('Invalid credentials')
      }

      // Remove the password before creating token, if needed
      const { senha, ...userWithoutPassword } = login
      const token = createToken(userWithoutPassword)
      return { token, login: userWithoutPassword }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error)
      }
      throw error
    }
  },

  /**
   * Registers a new user.
   * @param {Object} dados - Registration data.
   */
  async register (dados) {
    try {
      const hashedPassword = await bcrypt.hash(dados.senha, SALT_ROUNDS)

      const newUser = await prisma.user.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf,
          cnpj: dados?.cnpj,
          senha: hashedPassword,
          datanascimento: dados.datanascimento,
          razaosocial: dados?.razaosocial
        }
      })
      return newUser
    } catch (error) {
      // If the error comes from Prisma, wrap it in our custom error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error)
      }
      throw error
    }
  },

  /**
   * Generates a password recovery token, stores it in the recovery table with an expiration date,
   * builds a reset link, and returns the token and link.
   * @param {Object} dados - Object containing the email and/or CPF of the user requesting a password recovery.
   */
  async recoverPassword (dados) {
    console.log('Recovering password for:', dados)
    try {
      // Find the user by email or CPF.
      const userFound = await prisma.user.findFirst({
        where: {
          OR: [
            { email: dados.email },
            { cpf: dados.cpf }
          ]
        }
      })
      if (!userFound) {
        throw new Error('User not found.')
      }

      // Generate a secure random token (20 bytes -> 40 hex characters)
      const recoveryToken = crypto.randomBytes(20).toString('hex')
      // Set token to expire in 1 hour
      const tokenExpires = new Date(Date.now() + 3600000) // 1 hour in milliseconds

      // Create a new recovery record in the 'recuperacao' table
      await prisma.recuperacao.create({
        data: {
          token: recoveryToken,
          expiracao: tokenExpires,
          user: { connect: { userid: userFound.userid } }
        }
      })

      // Build the reset link.
      // It’s a good idea to store your front-end URL in an environment variable.
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081'
      // We’ll assume your reset page is at '/reset-password'
      const resetLink = `${frontendUrl}/#/reset-password?token=${recoveryToken}`

      console.log(`Recovery link for ${dados.email || dados.cpf}: ${resetLink}`)

      // Return both the token and reset link.
      return { recoveryToken, resetLink }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error)
      }
      throw error
    }
  },

  /**
   * Resets the user's password given a valid recovery token and new password.
   * @param {string} token - The recovery token sent to the user's email.
   * @param {string} newPassword - The new password to be set.
   */
  async resetPassword (token, newPassword) {
    try {
      // Find the recovery record by token
      const recoveryRecord = await prisma.recuperacao.findUnique({
        where: { token }
      })
      if (!recoveryRecord) {
        throw new UnauthorizedError('Invalid or expired token.')
      }

      // Check if token has expired
      if (new Date() > recoveryRecord.expiracao) {
        throw new UnauthorizedError('Recovery token has expired.')
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

      // Update the user's password
      await prisma.user.update({
        where: { userid: recoveryRecord.userid },
        data: { senha: hashedPassword }
      })

      // Optionally, delete the recovery record to invalidate the token
      await prisma.recuperacao.delete({
        where: { id: recoveryRecord.id }
      })

      return { message: 'Password reset successfully.' }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error)
      }
      throw error
    }
  },

  async validateResetPassword (token) {
    try {
      const recoveryRecord = await prisma.recuperacao.findUnique({
        where: { token }
      })
      if (!recoveryRecord) {
        throw new UnauthorizedError('Invalid token.')
      }

      if (new Date() > recoveryRecord.expiracao) {
        throw new UnauthorizedError('Recovery token has expired.')
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaClientError(error)
      }
      throw error
    }
  }

}
