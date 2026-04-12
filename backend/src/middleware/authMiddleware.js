import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { getUserById } from '../services/authService.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    req.userId = payload.sub
    req.userRole = payload.role
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export function requireRole(...roles) {
  return [
    authenticate,
    (req, res, next) => {
      if (!roles.includes(req.userRole)) {
        return res.status(403).json({ error: 'Acceso denegado' })
      }
      next()
    },
  ]
}

export async function loadUser(req, res, next) {
  if (!req.userId) return next()
  const user = await getUserById(req.userId)
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })
  req.user = user
  next()
}
