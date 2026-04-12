import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const RequestCtx = createContext(null)

const initialState = {
  step: 1,
  requestId: null,
  cedula: '',
  email: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  ciudadResidencia: '',
  estadoCivil: '',
  empresa: '',
  antiguedadLaboral: '',
  ingresosMensuales: 0,
  egresosMensuales: 0,
  productoId: '',
  productoNombre: '',
  monto: 0,
  plazoMeses: 0,
  periodicidad: '',
  metodoAmortizacion: 'frances',
  totalPagar: 0,
  cuotaMensual: 0,
  aceptaTerminos: false,
  aceptaDatos: false,
  aceptaVeracidad: false,
  docComprobanteIngresos: null,
  docPlanillaServicios: null,
  docDeclaracionImpuestos: null,
  docCedulaFrontal: null,
  docCedulaTrasera: null,
  selfieBase64: null,
  biometriaScore: null,
  biometriaAprobada: false,
  cedulaDescriptor: null,
  estado: 'Pendiente',
  notasAsesor: '',
  existingRequestId: null,
}

export function RequestProvider({ children }) {
  const [state, setState] = useState({ ...initialState })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const updateField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateFields = useCallback((obj) => {
    setState((prev) => ({ ...prev, ...obj }))
  }, [])

  const setStep = useCallback((step) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const resetRequest = useCallback(() => {
    setState({ ...initialState })
    setError(null)
  }, [])

  const submitRequest = useCallback(async () => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        id: state.requestId || crypto.randomUUID(),
        fechaCreacion: new Date().toISOString(),
        cedula: state.cedula,
        nombres: state.nombres,
        apellidos: state.apellidos,
        email: state.email,
        telefono: state.telefono,
        direccion: state.direccion,
        ciudadResidencia: state.ciudadResidencia,
        fechaNacimiento: state.fechaNacimiento,
        estadoCivil: state.estadoCivil,
        ingresosMensuales: state.ingresosMensuales,
        egresosMensuales: state.egresosMensuales,
        antiguedadLaboral: state.antiguedadLaboral,
        empresa: state.empresa,
        productoId: state.productoId,
        productoNombre: state.productoNombre,
        monto: state.monto,
        plazoMeses: state.plazoMeses,
        periodicidad: state.periodicidad,
        metodoAmortizacion: state.metodoAmortizacion,
        totalPagar: state.totalPagar,
        cuotaMensual: state.cuotaMensual,
        docCedulaFrontal: state.docCedulaFrontal,
        docCedulaTrasera: state.docCedulaTrasera,
        docComprobanteIngresos: state.docComprobanteIngresos,
        docPlanillaServicios: state.docPlanillaServicios,
        docDeclaracionImpuestos: state.docDeclaracionImpuestos,
        selfieBase64: state.selfieBase64,
        biometriaScore: state.biometriaScore,
        biometriaAprobada: state.biometriaAprobada,
        estado: state.biometriaAprobada ? 'Pendiente' : 'Observacion',
      }
      const result = await api.createRequest(payload)
      setState((prev) => ({
        ...prev,
        requestId: result.id,
        existingRequestId: result.id,
        estado: result.estado,
        step: 8,
      }))
      return result
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setSubmitting(false)
    }
  }, [state])

  const value = useMemo(
    () => ({
      ...state,
      submitting,
      error,
      updateField,
      updateFields,
      setStep,
      resetRequest,
      submitRequest,
    }),
    [state, submitting, error, updateField, updateFields, setStep, resetRequest, submitRequest],
  )

  return <RequestCtx.Provider value={value}>{children}</RequestCtx.Provider>
}

export function useRequest() {
  const ctx = useContext(RequestCtx)
  if (!ctx) throw new Error('useRequest must be used within RequestProvider')
  return ctx
}
