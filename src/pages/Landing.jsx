import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInstitution } from '../context/InstitutionalContext.jsx'

export default function Landing() {
  const { profile } = useInstitution()

  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -20%, var(--sfici-primary), transparent), radial-gradient(ellipse 60% 50% at 100% 0%, #334155, transparent)`,
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:py-24">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-4"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300/90">SFICI</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Simulador financiero integral de créditos e inversiones
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">{profile.lema}</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <Link
            to="/admin"
            className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-sky-400/40 hover:bg-white/10"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
              Administrador / asesor
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Configuración institucional, productos, tasas, cobros y revisión de solicitudes.
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-sky-300 group-hover:underline">
              Entrar al panel →
            </span>
          </Link>
          <Link
            to="/cliente"
            className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-sky-400/40 hover:bg-white/10"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
              Cliente
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Simular créditos e inversiones, comparar métodos, generar PDF y solicitudes en línea.
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-sky-300 group-hover:underline">
              Ir al portal →
            </span>
          </Link>
        </motion.div>

        <footer className="border-t border-white/10 pt-8 text-xs text-slate-500">
          {profile.nombre} · Plataforma de referencia académica — {profile.ruc}
        </footer>
      </div>
    </div>
  )
}
