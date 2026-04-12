import { prisma } from '../db/prisma.js'

export async function createRequest(data) {
  return prisma.creditRequest.create({
    data: {
      ...data,
      fechaCreacion: new Date(data.fechaCreacion),
    },
  })
}

export async function listRequests(limit = 100) {
  return prisma.creditRequest.findMany({
    orderBy: { fechaCreacion: 'desc' },
    take: Math.min(limit, 500),
  })
}

export async function getRequestById(id) {
  return prisma.creditRequest.findUnique({ where: { id } })
}

export async function getRequestsByCedula(cedula) {
  return prisma.creditRequest.findMany({
    where: { cedula },
    orderBy: { fechaCreacion: 'desc' },
  })
}

export async function reviewRequest(id, { estado, notasAsesor }) {
  return prisma.creditRequest.update({
    where: { id },
    data: {
      estado,
      notasAsesor: notasAsesor ?? null,
      fechaRevision: new Date(),
    },
  })
}
