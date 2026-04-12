import { Router } from 'express'
import { validateBody } from '../middleware/validate.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { loginSchema, registerSchema } from '../schemas/authSchemas.js'
import { getUserById, login, registerClient } from '../services/authService.js'

export const authRouter = Router()

authRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await registerClient(req.body)
    res.status(201).json(result)
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ error: e.message })
    }
    next(e)
  }
})

authRouter.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await login(req.body)
    res.json(result)
  } catch (e) {
    if (e.status) {
      return res.status(e.status).json({ error: e.message })
    }
    next(e)
  }
})

authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await getUserById(req.userId)
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })
    res.json(user)
  } catch (e) {
    next(e)
  }
})
