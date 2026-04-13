import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiRouter } from './routes/api.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../../dist')
const isProduction = env.NODE_ENV === 'production'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')

  app.use(morgan(isProduction ? 'combined' : 'dev'))
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: false,
    }),
  )
  app.use(express.json({ limit: '15mb' }))

  // --- Serve Vite build in production ---
  if (isProduction && existsSync(distPath)) {
    app.use(express.static(distPath))
  }

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
  })

  app.use('/api', apiRouter)

  // --- SPA fallback: non-API routes serve index.html ---
  if (isProduction && existsSync(distPath)) {
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'))
    })
  }

  app.use(errorHandler)
  return app
}

