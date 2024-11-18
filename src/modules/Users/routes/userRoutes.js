// src/modules/Users/routes/userRoutes.js
import { Router } from 'express'
import { loginUser, registerUser } from '../../Users/services/userService.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { token, login } = await loginUser(req.body)
    res.status(200).json({ token, user: login })
  } catch (error) {
    next(error) // Pass error to the error handling middleware
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body)
    res.status(201).json({ user: newUser })
  } catch (error) {
    next(error) // Pass error to the error handling middleware
  }
})

export default router
