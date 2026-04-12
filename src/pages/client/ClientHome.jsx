import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useInstitution } from '../../context/InstitutionalContext.jsx'

export default function ClientHome() {
  const { profile } = useInstitution()
  const { user } = useAuth()

  const displayName = user?.nombres
    ? `${user.nombres} ${user.apellidos || ''}`.trim()
    : null

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {displayName ? `Bienvenido, ${displayName}` : 'Bienvenido'}
        </h1>
        <p className="mt-2 text-slate-600">
          {profile.nombre} — {profile.lema}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/cliente/simulacion"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
        >
          <h2 className="font-medium text-slate-900">Simulación de crédito</h2>
          <p className="mt-2 text-sm text-slate-600">Método francés y alemán, comparación y PDF.</p>
        </Link>
        <Link
          to="/cliente/inversion"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
        >
          <h2 className="font-medium text-slate-900">Inversiones</h2>
          <p className="mt-2 text-sm text-slate-600">Interés simple vs compuesto y tablas de crecimiento.</p>
        </Link>
        <Link
          to="/cliente/historial"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
        >
          <h2 className="font-medium text-slate-900">Historial</h2>
          <p className="mt-2 text-sm text-slate-600">Simulaciones guardadas y estados del proceso.</p>
        </Link>
        <Link
          to="/cliente/solicitud"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
        >
          <h2 className="font-medium text-slate-900">Solicitud en línea</h2>
          <p className="mt-2 text-sm text-slate-600">Flujo digital y validación biométrica simulada.</p>
        </Link>
      </div>
    </motion.div>
  )
}
