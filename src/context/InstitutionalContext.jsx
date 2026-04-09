import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'sfici_institution_v1'

const defaultProfile = {
  nombre: 'Institución Financiera Demo',
  ruc: '1790012345001',
  direccion: 'Av. Principal 123, Quito',
  telefonos: '+593 2 000 0000',
  email: 'contacto@institucion.demo',
  lema: 'Tu aliado en crédito e inversión',
  pieDocumentos:
    'Este documento es referencial. Las condiciones definitivas se formalizan en el contrato respectivo.',
  colorPrimario: '#0284c7',
  colorSecundario: '#0f172a',
  logoDataUrl: null,
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProfile
    return { ...defaultProfile, ...JSON.parse(raw) }
  } catch {
    return defaultProfile
  }
}

const InstitutionalContext = createContext(null)

export function InstitutionalProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile)

  const value = useMemo(
    () => ({
      profile,
      setProfile: (next) => {
        setProfile((p) => {
          const merged = typeof next === 'function' ? next(p) : { ...p, ...next }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          return merged
        })
      },
      reset: () => {
        localStorage.removeItem(STORAGE_KEY)
        setProfile(defaultProfile)
      },
    }),
    [profile],
  )

  return (
    <InstitutionalContext.Provider value={value}>
      <div
        className="min-h-dvh"
        style={
          {
            '--sfici-primary': profile.colorPrimario,
            '--sfici-secondary': profile.colorSecundario,
          }
        }
      >
        {children}
      </div>
    </InstitutionalContext.Provider>
  )
}

export function useInstitution() {
  const ctx = useContext(InstitutionalContext)
  if (!ctx) throw new Error('useInstitution debe usarse dentro de InstitutionalProvider')
  return ctx
}
