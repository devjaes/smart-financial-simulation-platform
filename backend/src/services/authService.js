import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma.js'
import { env } from '../config/env.js'

const SALT_ROUNDS = 10
const TOKEN_EXPIRY = '7d'

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  })
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

export async function registerClient({
  email,
  password,
  cedula,
  nombres,
  apellidos,
  telefono,
}) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { cedula }] },
  })
  if (existing) {
    const field = existing.email === email ? 'email' : 'cédula'
    const err = new Error(`Ya existe un usuario con ese ${field}`)
    err.status = 409
    throw err
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'client',
      cedula,
      nombres,
      apellidos,
      telefono,
    },
  })

  const token = signToken(user)
  return { token, user: sanitizeUser(user) }
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const err = new Error('Credenciales inválidas')
    err.status = 401
    throw err
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    const err = new Error('Credenciales inválidas')
    err.status = 401
    throw err
  }

  const token = signToken(user)
  return { token, user: sanitizeUser(user) }
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return null
  return sanitizeUser(user)
}

export async function seedAdminUser() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@sfici.com' },
  })
  if (existing) return

  const passwordHash = await bcrypt.hash('admin123', SALT_ROUNDS)
  await prisma.user.create({
    data: {
      email: 'admin@sfici.com',
      passwordHash,
      role: 'admin',
      nombres: 'Administrador',
      apellidos: 'SFICI',
    },
  })
  // eslint-disable-next-line no-console
  console.log('[seed] Admin user created: admin@sfici.com / admin123')
}
