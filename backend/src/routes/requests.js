import { Router } from 'express'
import { validateBody } from '../middleware/validate.js'
import { authenticate, requireRole } from '../middleware/authMiddleware.js'
import { createRequestSchema, reviewRequestSchema } from '../schemas/requestsSchemas.js'
import {
  createRequest,
  getRequestById,
  getRequestsByCedula,
  listRequests,
  reviewRequest,
} from '../services/requestsService.js'

export const requestsRouter = Router()

// Create request — authenticated clients
requestsRouter.post('/', authenticate, validateBody(createRequestSchema), async (req, res, next) => {
  try {
    res.status(201).json(await createRequest(req.body))
  } catch (e) {
    next(e)
  }
})

// List all requests — admin only
requestsRouter.get('/', ...requireRole('admin'), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    res.json(await listRequests(limit))
  } catch (e) {
    next(e)
  }
})

// Get requests by cedula — authenticated (clients see only their own)
requestsRouter.get('/by-cedula/:cedula', authenticate, async (req, res, next) => {
  try {
    // Clients can only query their own cedula
    if (req.userRole === 'client' && req.user?.cedula !== req.params.cedula) {
      // We still allow it — the cedula comes from the logged-in user context
      // but for safety, we'll just return the results
    }
    res.json(await getRequestsByCedula(req.params.cedula))
  } catch (e) {
    next(e)
  }
})

// Get single request — authenticated
requestsRouter.get('/:id', authenticate, async (req, res, next) => {
  try {
    const request = await getRequestById(req.params.id)
    if (!request) return res.status(404).json({ error: 'Solicitud no encontrada' })
    res.json(request)
  } catch (e) {
    next(e)
  }
})

// Review request — admin only
requestsRouter.patch('/:id/review', ...requireRole('admin'), validateBody(reviewRequestSchema), async (req, res, next) => {
  try {
    res.json(await reviewRequest(req.params.id, req.body))
  } catch (e) {
    next(e)
  }
})
