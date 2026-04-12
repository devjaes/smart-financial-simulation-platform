import { Router } from 'express'
import { authRouter } from './auth.js'
import { catalogRouter } from './catalog.js'
import { institutionRouter } from './institution.js'
import { historyRouter } from './history.js'
import { requestsRouter } from './requests.js'

export const apiRouter = Router()

// Public
apiRouter.use('/auth', authRouter)

// These routers handle their own auth per-route
apiRouter.use('/catalog', catalogRouter)
apiRouter.use('/institution', institutionRouter)
apiRouter.use('/history', historyRouter)
apiRouter.use('/requests', requestsRouter)
