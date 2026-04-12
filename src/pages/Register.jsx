import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useInstitution } from '../context/InstitutionalContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const { profile } = useInstitution()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    cedula: '',
    email: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const brand = useMemo(() => {
    const parts = String(profile.nombre || 'SFICI').split(' ')
    return {
      title: parts.length > 1 ? parts.slice(0, 2).join(' ') : parts[0],
      subtitle: parts.length > 2 ? parts.slice(2).join(' ') : '',
    }
  }, [profile.nombre])

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.cedula || form.cedula.length < 10) e.cedula = 'Mínimo 10 dígitos'
    if (!form.email || !form.email.includes('@')) e.email = 'Email inválido'
    if (!form.nombres.trim()) e.nombres = 'Requerido'
    if (!form.apellidos.trim()) e.apellidos = 'Requerido'
    if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'No coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setServerError(null)
    setSubmitting(true)
    try {
      const { confirmPassword: _confirmPassword, ...data } = form
      await register(data)
      navigate('/cliente', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Error al registrarse')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20'

  return (
    <div
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8"
      style={{ background: '#f8fafc' }}
    >
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.07,
          backgroundImage: 'url("/pattern-money.png")',
          backgroundRepeat: 'repeat',
          backgroundSize: '320px 320px',
          mixBlendMode: 'multiply',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg"
      >
        <div
          className="overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          style={{ borderColor: 'rgba(2,6,23,0.10)', background: 'rgba(255,255,255,0.96)' }}
        >
          {/* Header */}
          <div
            className="relative px-8 pb-6 pt-8"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,42,29,0.98) 0%, rgba(5,20,13,0.98) 100%)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 90% 70% at 0% 0%, rgba(22,163,74,0.16), transparent 60%)',
              }}
            />
            <div className="relative">
              <Link
                to="/login"
                className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-white/60 transition hover:text-white/90"
              >
                ← Volver al login
              </Link>
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                Crear cuenta {brand.subtitle && <span className="text-white/60">— {brand.title}</span>}
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Regístrate para acceder al portal del cliente.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-8 py-7">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </motion.div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Cédula de identidad</span>
                <input
                  className={inputClass}
                  value={form.cedula}
                  maxLength={13}
                  onChange={(e) => update('cedula', e.target.value.replace(/\D/g, ''))}
                  placeholder="1712345678"
                />
                {errors.cedula && <span className="mt-1 text-xs text-red-500">{errors.cedula}</span>}
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Correo electrónico</span>
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && <span className="mt-1 text-xs text-red-500">{errors.email}</span>}
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Nombres</span>
                <input
                  className={inputClass}
                  value={form.nombres}
                  onChange={(e) => update('nombres', e.target.value)}
                  placeholder="Juan Carlos"
                />
                {errors.nombres && <span className="mt-1 text-xs text-red-500">{errors.nombres}</span>}
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Apellidos</span>
                <input
                  className={inputClass}
                  value={form.apellidos}
                  onChange={(e) => update('apellidos', e.target.value)}
                  placeholder="Pérez López"
                />
                {errors.apellidos && <span className="mt-1 text-xs text-red-500">{errors.apellidos}</span>}
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Teléfono</span>
                <input
                  className={inputClass}
                  value={form.telefono}
                  onChange={(e) => update('telefono', e.target.value)}
                  placeholder="0991234567"
                />
              </label>
            </div>

            <hr className="border-slate-100" />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Contraseña</span>
                <input
                  className={inputClass}
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <span className="mt-1 text-xs text-red-500">{errors.password}</span>}
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Confirmar contraseña</span>
                <input
                  className={inputClass}
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Repita la contraseña"
                />
                {errors.confirmPassword && (
                  <span className="mt-1 text-xs text-red-500">{errors.confirmPassword}</span>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
              style={{
                background: '#16A34A',
                boxShadow: '0 10px 30px rgba(22,163,74,0.25)',
              }}
            >
              {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>

            <div className="text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          {profile.nombre} · Sistema de simulación financiera
        </p>
      </motion.div>
    </div>
  )
}
