import { prisma } from '../db/prisma.js'

export async function createInvestmentRequest(data) {
  return prisma.investmentRequest.create({
    data: { ...data, fechaCreacion: new Date(data.fechaCreacion) },
  })
}

export async function listInvestmentRequests(limit = 100) {
  return prisma.investmentRequest.findMany({
    orderBy: { fechaCreacion: 'desc' },
    take: Math.min(limit, 500),
  })
}

export async function getInvestmentRequestById(id) {
  return prisma.investmentRequest.findUnique({ where: { id } })
}

export async function getInvestmentRequestsByCedula(cedula) {
  return prisma.investmentRequest.findMany({
    where: { cedula },
    orderBy: { fechaCreacion: 'desc' },
  })
}

export async function reviewInvestmentRequest(id, { estado, notasAsesor }) {
  return prisma.investmentRequest.update({
    where: { id },
    data: { estado, notasAsesor: notasAsesor ?? null, fechaRevision: new Date() },
  })
}
