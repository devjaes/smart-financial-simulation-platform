import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const InvestmentRequestCtx = createContext(null)

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
  capitalInicial: 0,
  plazoMeses: 0,
  tipoInteres: 'compuesto',
  capitalizacion: 'mensual',
  aportePeriodico: 0,
  rendimientoTotal: 0,
  interesGanado: 0,
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

export function InvestmentRequestProvider({ children }) {
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
        capitalInicial: state.capitalInicial,
        plazoMeses: state.plazoMeses,
        tipoInteres: state.tipoInteres,
        capitalizacion: state.capitalizacion,
        aportePeriodico: state.aportePeriodico,
        rendimientoTotal: state.rendimientoTotal,
        interesGanado: state.interesGanado,
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
      const result = await api.createInvestmentRequest(payload)
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

  return <InvestmentRequestCtx.Provider value={value}>{children}</InvestmentRequestCtx.Provider>
}

export function useInvestmentRequest() {
  const ctx = useContext(InvestmentRequestCtx)
  if (!ctx) throw new Error('useInvestmentRequest must be used within InvestmentRequestProvider')
  return ctx
}
