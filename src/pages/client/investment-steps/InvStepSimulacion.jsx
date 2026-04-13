import { useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useInvestmentRequest } from '../../../context/InvestmentRequestContext.jsx'
import { useCatalog } from '../../../context/CatalogContext.jsx'
import { compoundWithContributions, simpleInterestMaturity, compareSimpleVsCompound } from '../../../lib/investment.js'
import { formatCurrency } from '../../../lib/currency.js'

const capMap = { mensual: 12, trimestral: 4, semestral: 2, anual: 1 }

export default function InvStepSimulacion() {
  const ctx = useInvestmentRequest()
  const { productoId, capitalInicial, plazoMeses, tipoInteres, capitalizacion, aportePeriodico, updateField, updateFields, setStep } = ctx
  const { investmentProducts } = useCatalog()

  const product = useMemo(() => investmentProducts.find((p) => p.id === productoId), [investmentProducts, productoId])

  const years = plazoMeses / 12
  const paymentsPerYear = capMap[capitalizacion] ?? 12

  const result = useMemo(() => {
    if (!product || !capitalInicial || !plazoMeses) return null
    if (tipoInteres === 'simple') {
      return simpleInterestMaturity(capitalInicial, product.tasaAnual, years)
    }
    return compoundWithContributions({
      initialCapital: capitalInicial,
      annualRate: product.tasaAnual,
      years,
      paymentsPerYear,
      periodicContribution: aportePeriodico,
    })
  }, [product, capitalInicial, plazoMeses, tipoInteres, years, paymentsPerYear, aportePeriodico])

  const comparison = useMemo(() => {
    if (!product || !capitalInicial || !plazoMeses) return null
    return compareSimpleVsCompound(capitalInicial, product.tasaAnual, years, paymentsPerYear)
  }, [product, capitalInicial, plazoMeses, years, paymentsPerYear])

  const chartData = useMemo(() => {
    if (!result?.table) return []
    return result.table.map((row) => ({ periodo: row.period, acumulado: row.accumulated }))
  }, [result])

  const handleNext = () => {
    if (!result) return
    updateFields({
      rendimientoTotal: result.finalCapital,
      interesGanado: result.interestGenerated,
    })
    setStep(5)
  }

  if (!product) return <p className="text-slate-600">Producto no encontrado. Vuelva al paso anterior.</p>

  const inputClass = 'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Simulación de inversión</h2>
        <p className="mt-1 text-sm text-slate-600">Configure los parámetros y revise la proyección de rendimiento.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Parámetros</h3>
          <label className="block text-sm">
            <span className="text-slate-600">Capital inicial</span>
            <input className={inputClass} type="number" value={capitalInicial || ''} min={product.montoMin} onChange={(e) => updateField('capitalInicial', Number(e.target.value))} />
            <span className="text-xs text-slate-400">Mínimo: {formatCurrency(product.montoMin)}</span>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Plazo (meses)</span>
            <select className={inputClass} value={plazoMeses || ''} onChange={(e) => updateField('plazoMeses', Number(e.target.value))}>
              <option value="">Seleccione...</option>
              {(product.plazoMeses || []).map((m) => <option key={m} value={m}>{m} meses</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Tipo de interés</span>
            <select className={inputClass} value={tipoInteres} onChange={(e) => updateField('tipoInteres', e.target.value)}>
              <option value="simple">Interés simple</option>
              <option value="compuesto">Interés compuesto</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Capitalización</span>
            <select className={inputClass} value={capitalizacion} onChange={(e) => updateField('capitalizacion', e.target.value)}>
              {Object.keys(capMap).map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
          {tipoInteres === 'compuesto' && (
            <label className="block text-sm">
              <span className="text-slate-600">Aporte periódico</span>
              <input className={inputClass} type="number" value={aportePeriodico} min={0} onChange={(e) => updateField('aportePeriodico', Number(e.target.value))} />
            </label>
          )}
        </div>

        {result && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resumen</h3>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Capital inicial</dt><dd className="font-medium">{formatCurrency(capitalInicial)}</dd></div>
              <div><dt className="text-slate-500">Rendimiento total</dt><dd className="font-medium text-emerald-700">{formatCurrency(result.finalCapital)}</dd></div>
              <div><dt className="text-slate-500">Interés ganado</dt><dd className="font-medium text-emerald-700">{formatCurrency(result.interestGenerated)}</dd></div>
              {result.periods && <div><dt className="text-slate-500">N° períodos</dt><dd className="font-medium">{result.periods}</dd></div>}
            </dl>
          </div>
        )}
      </div>

      {comparison && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-5">
          <h3 className="text-sm font-semibold text-emerald-900">Comparación simple vs compuesto</h3>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div><span className="text-emerald-800/70">Simple:</span> <strong className="text-emerald-900">{formatCurrency(comparison.simple.finalCapital)}</strong></div>
            <div><span className="text-emerald-800/70">Compuesto:</span> <strong className="text-emerald-900">{formatCurrency(comparison.compound.finalCapital)}</strong></div>
            <div><span className="text-emerald-800/70">Diferencia:</span> <strong className="text-emerald-700">{formatCurrency(comparison.compound.finalCapital - comparison.simple.finalCapital)}</strong></div>
          </div>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-800">Proyección de crecimiento</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="acumulado" stroke="var(--sfici-primary)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" className="rounded-lg border border-slate-200 px-5 py-2 text-sm" onClick={() => setStep(3)}>Anterior</button>
        <button type="button" disabled={!result} className="rounded-lg px-5 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ backgroundColor: 'var(--sfici-primary)' }} onClick={handleNext}>Siguiente</button>
      </div>
    </div>
  )
}
