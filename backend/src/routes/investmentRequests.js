import { Router } from 'express'
import { validateBody } from '../middleware/validate.js'
import { createInvestmentRequestSchema, reviewInvestmentRequestSchema } from '../schemas/investmentRequestsSchemas.js'
import {
  createInvestmentRequest,
  getInvestmentRequestById,
  getInvestmentRequestsByCedula,
  listInvestmentRequests,
  reviewInvestmentRequest,
} from '../services/investmentRequestsService.js'

export const investmentRequestsRouter = Router()

investmentRequestsRouter.post('/', validateBody(createInvestmentRequestSchema), async (req, res, next) => {
  try {
    res.status(201).json(await createInvestmentRequest(req.body))
  } catch (e) { next(e) }
})

investmentRequestsRouter.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    res.json(await listInvestmentRequests(limit))
  } catch (e) { next(e) }
})

investmentRequestsRouter.get('/by-cedula/:cedula', async (req, res, next) => {
  try {
    res.json(await getInvestmentRequestsByCedula(req.params.cedula))
  } catch (e) { next(e) }
})

investmentRequestsRouter.get('/:id', async (req, res, next) => {
  try {
    const request = await getInvestmentRequestById(req.params.id)
    if (!request) return res.status(404).json({ error: 'Solicitud no encontrada' })
    res.json(request)
  } catch (e) { next(e) }
})

investmentRequestsRouter.patch('/:id/review', validateBody(reviewInvestmentRequestSchema), async (req, res, next) => {
  try {
    res.json(await reviewInvestmentRequest(req.params.id, req.body))
  } catch (e) { next(e) }
})
