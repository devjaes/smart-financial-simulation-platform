import { motion } from 'framer-motion'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useInstitution } from '../../context/InstitutionalContext.jsx'

const adminLinks = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/config', label: 'Configuración institucional' },
  { to: '/admin/creditos', label: 'Tipos de crédito' },
  { to: '/admin/cobros', label: 'Cobros indirectos' },
  { to: '/admin/inversiones', label: 'Productos de inversión' },
]

const clientLinks = [
  { to: '/cliente', label: 'Inicio', end: true },
  { to: '/cliente/simulacion', label: 'Simulación de crédito' },
  { to: '/cliente/inversion', label: 'Inversiones' },
  { to: '/cliente/historial', label: 'Historial' },
  { to: '/cliente/solicitud', label: 'Solicitud en línea' },
]

export default function AppShell({ mode }) {
  const { profile } = useInstitution()
  const links = mode === 'admin' ? adminLinks : clientLinks
  const title = mode === 'admin' ? 'Panel administrador' : 'Portal cliente'

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full shrink-0 border-b border-slate-200 bg-white md:w-64 md:border-b-0 md:border-r"
      >
        <div className="flex flex-col gap-1 p-4">
          <Link to="/" className="mb-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
            ← SFICI
          </Link>
          <div className="mb-3">
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">
              {profile.nombre}
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          </div>
          <nav className="flex flex-col gap-0.5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')
                }
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: 'var(--sfici-primary)', color: '#fff' }
                    : undefined
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.aside>
      <main className="min-h-dvh flex-1 bg-slate-50 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
