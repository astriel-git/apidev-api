import pkg from 'jsonwebtoken'
import { secretKey } from '../auth/jwt.js'
const { verify } = pkg

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function verifyToken (req, res, next) {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }

  try {
    const decoded = verify(token.replace('Bearer ', ''), secretKey)

    // toda vez que um token é verificado, o usuário é colocado no req.user
    // verifique a propriedade req.user.sub para obter o id do usuário logado
    req.user = { ...decoded }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}
