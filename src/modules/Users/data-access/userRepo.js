// src/modules/Users/data-access/userRepo.js
import prisma from '../../../config/prismaClient.js'
import { PrismaClientError } from '../../../core/errors/customErrors.js'
import { Prisma } from '@prisma/client'
import { createToken } from '../../../core/auth/jwt.js'

export const user = {
  /**
   * Attempts to find a user by credentials.
   * @param {Object} dados - Login data.
   */
  async login (dados) {
    try {
      const login = await prisma.user.findUnique({
        select: {
          userId: true,
          role: true,
          nome: true,
          email: true
        },
        where: {
          email: dados.email,
          cpf: dados.cpf,
          senha: dados.senha
        }
      })
      const token = createToken(login)
      return { token, login }
    } catch (error) {
      // If the error comes from Prisma, wrap it in our custom error
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
      const newUser = await prisma.user.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf,
          cnpj: dados?.cnpj,
          senha: dados.senha,
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
