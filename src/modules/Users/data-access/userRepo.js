import prisma from '../../../config/prismaClient.js'
import { createToken } from '../../../core/auth/jwt.js'

export const user = {
  /** @param {import('express').Request}  */
  async login (dados) {
    const login = await prisma.user.findUnique({
      select: {
        userId: true,
        role: true
      },
      where: {
        email: dados.email,
        cpf: dados.cpf,
        cnpj: dados.cnpj,
        senha: dados.senha
      }
    })

    const token = createToken(login)
    return { token, login }
  },

  async register (dados) {
    try {
      const newuser = await prisma.user.create({
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

      return newuser
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      throw error
    }
  }

}
