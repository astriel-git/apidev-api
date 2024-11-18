import pkg from 'jsonwebtoken'
const { sign } = pkg

// mude o valor abaixo para uma chave secreta mais segura
export const secretKey = 'L1337-P07!#HK.'

/**
 *  essa função cria um token para o usuário utilizando o id do usuário apenas modifique para seu uso
 *  @param {Object} user
 *  @param {number} user.iduser
 */
export function createToken (user) {
  if (!user) {
    throw new Error('usuario não informado')
  }

  // abaixo é um exemplo de payload sub por padrão recebe o id do usuario
  // você pode adicionar mais informações ao payload
  /** @type {import('jsonwebtoken').JwtPayload} */
  const payload = {
    sub: user.userId
  }

  const token = sign(payload, secretKey, { expiresIn: '10h' })

  return {
    token
  }
}
