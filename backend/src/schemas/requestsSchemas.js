import { z } from 'zod'

const estadoEnum = z.enum(['Pendiente', 'Observacion', 'En revision', 'Aprobado', 'Rechazado'])

export const createRequestSchema = z.object({
  id: z.string().min(1),
  fechaCreacion: z.string().min(1),
  cedula: z.string().min(10).max(13),
  nombres: z.string().min(1),
  apellidos: z.string().min(1),
  email: z.string().email(),
  telefono: z.string().min(7),
  direccion: z.string().min(1),
  ciudadResidencia: z.string().min(1),
  fechaNacimiento: z.string().min(1),
  estadoCivil: z.string().min(1),
  ingresosMensuales: z.number().min(0),
  egresosMensuales: z.number().min(0),
  antiguedadLaboral: z.string().min(1),
  empresa: z.string().min(1),
  productoId: z.string().min(1),
  productoNombre: z.string().min(1),
  monto: z.number().positive(),
  plazoMeses: z.number().int().positive(),
  periodicidad: z.string().min(1),
  metodoAmortizacion: z.enum(['frances', 'aleman']),
  totalPagar: z.number().positive(),
  cuotaMensual: z.number().positive(),
  docCedulaFrontal: z.string().nullable().optional(),
  docCedulaTrasera: z.string().nullable().optional(),
  docComprobanteIngresos: z.string().nullable().optional(),
  docPlanillaServicios: z.string().nullable().optional(),
  docDeclaracionImpuestos: z.string().nullable().optional(),
  selfieBase64: z.string().nullable().optional(),
  biometriaScore: z.number().min(0).max(1).nullable().optional(),
  biometriaAprobada: z.boolean().optional(),
  estado: estadoEnum.optional(),
})

export const reviewRequestSchema = z.object({
  estado: estadoEnum,
  notasAsesor: z.string().optional(),
})
