import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const cards = [
  {
    to: '/admin/config',
    title: 'Configuración institucional',
    desc: 'Logo, datos legales, colores y pie de documentos PDF.',
  },
  {
    to: '/admin/creditos',
    title: 'Tipos de crédito',
    desc: 'CRUD de productos, tasas, plazos y periodicidades.',
  },
  {
    to: '/admin/cobros',
    title: 'Cobros indirectos',
    desc: 'Seguros, comisiones, cargos fijos o porcentuales.',
  },
  {
    to: '/admin/inversiones',
    title: 'Productos de inversión',
    desc: 'Ahorro programado, plazo fijo, certificados, etc.',
  },
  {
    to: '/admin/solicitudes',
    title: 'Solicitudes de crédito',
    desc: 'Revisión y gestión de solicitudes de crédito enviadas por clientes.',
  },
]

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
          Panel administrador
        </h1>
        <p className="mt-1 text-slate-600">
          Parametrice la institución y los catálogos que alimentan las simulaciones del cliente.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={c.to}
              className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
            >
              <h2 className="font-medium text-slate-900">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
