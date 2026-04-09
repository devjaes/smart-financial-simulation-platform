import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  { id: 1, title: 'Registro del cliente', desc: 'Cuenta y credenciales (simulado).' },
  { id: 2, title: 'Datos personales', desc: 'Nombre, dirección, ingresos.' },
  { id: 3, title: 'Selección de producto', desc: 'Tipo de crédito o inversión.' },
  { id: 4, title: 'Simulación', desc: 'Parámetros y resultado referencial.' },
  { id: 5, title: 'Confirmación', desc: 'Aceptación de condiciones generales.' },
  { id: 6, title: 'Documentos', desc: 'Carga de archivos PDF / imágenes.' },
  { id: 7, title: 'Validación biométrica', desc: 'Selfie, documento y prueba de vida.' },
  { id: 8, title: 'Revisión', desc: 'Cola del asesor.' },
  { id: 9, title: 'Resultado', desc: 'Notificación de decisión.' },
]

const bioSubsteps = [
  { id: 'selfie', label: 'Captura de selfie (cámara)' },
  { id: 'doc', label: 'Documento de identidad' },
  { id: 'match', label: 'Coincidencia facial (simulada)' },
  { id: 'smile', label: 'Prueba de vida: sonrisa' },
  { id: 'blink', label: 'Prueba de vida: parpadeo' },
]

export default function RequestFlow() {
  const [step, setStep] = useState(1)
  const [bioStep, setBioStep] = useState(0)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
      }
    } catch {
      alert('No se pudo acceder a la cámara. Continúe en modo demostración.')
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Solicitud en línea</h1>
        <p className="mt-1 text-sm text-slate-600">
          Flujo digital de punta a punta con validación biométrica simulada.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={[
              'rounded-full px-3 py-1 text-xs font-medium transition',
              step === s.id ? 'text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
            ].join(' ')}
            style={step === s.id ? { backgroundColor: 'var(--sfici-primary)' } : undefined}
          >
            {s.id}. {s.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">{steps.find((s) => s.id === step)?.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{steps.find((s) => s.id === step)?.desc}</p>

          {step === 7 && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {bioSubsteps.map((b, i) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBioStep(i)}
                    className={[
                      'rounded-lg px-3 py-2 text-xs',
                      bioStep === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700',
                    ].join(' ')}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-700">
                  Estado simulado:{' '}
                  <strong>
                    {bioStep < 3 ? 'Pendiente' : bioStep < 5 ? 'Biometría validada' : 'Observación'}
                  </strong>
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {!stream ? (
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                      style={{ backgroundColor: 'var(--sfici-primary)' }}
                      onClick={startCamera}
                    >
                      Activar cámara
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                      onClick={stopCamera}
                    >
                      Detener cámara
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                    onClick={() => setBioStep((b) => Math.min(b + 1, bioSubsteps.length - 1))}
                  >
                    Simular siguiente prueba de vida
                  </button>
                </div>
                <video ref={videoRef} autoPlay playsInline muted className="mt-4 max-h-48 w-full rounded-lg bg-black object-cover" />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
              disabled={step <= 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--sfici-primary)' }}
              onClick={() => setStep((s) => Math.min(9, s + 1))}
            >
              Siguiente
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-xs text-slate-500">
        Estados del proceso: Pendiente · Documento cargado · Biometría validada · Observación · Aprobado preliminarmente
        (simulación local).
      </p>
    </motion.div>
  )
}
