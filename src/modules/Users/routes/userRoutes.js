// src/modules/Users/routes/userRoutes.js
import { Router } from 'express'
import { loginUser, registerUser, recoverPassword, resetPassword, validateResetPassword } from '../../Users/services/userService.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { token, login } = await loginUser(req.body)
    res.status(200).json({ token, user: login })
  } catch (error) {
    next(error)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body)
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: newUser })
  } catch (error) {
    next(error)
  }
})

router.post('/recuperar', async (req, res, next) => {
  try {
    const result = await recoverPassword(req.body)
    res.status(201).json({ message: 'Email de recuperação enviado com sucesso', result })
  } catch (error) {
    next(error)
  }
})

router.post('/reset', async (req, res) => {
  const result = await resetPassword(req.body)
  res.json(result)
})

router.post('/validate-reset', async (req, res) => {
  const result = await validateResetPassword(req.body)
  res.json(result)
})

export default router
