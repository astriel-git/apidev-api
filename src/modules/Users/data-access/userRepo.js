// src/modules/Users/data-access/userRepo.js
import prisma from '../../../config/prismaClient.js'
import bcrypt from 'bcrypt'
import { PrismaClientError } from '../../../core/errors/customErrors.js'
import { Prisma } from '@prisma/client'
import { createToken } from '../../../core/auth/jwt.js'

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
  }
}
