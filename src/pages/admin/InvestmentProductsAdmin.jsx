import { motion } from 'framer-motion'
import { useCatalog } from '../../context/CatalogContext.jsx'

export default function InvestmentProductsAdmin() {
  const { investmentProducts, setInvestmentProducts } = useCatalog()

  const update = (id, patch) => {
    setInvestmentProducts(investmentProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Productos de inversión</h1>
        <p className="mt-1 text-sm text-slate-600">Tasas, plazos y parámetros de capitalización.</p>
      </div>

      <div className="grid gap-4">
        {investmentProducts.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-medium text-slate-900">{p.nombre}</h2>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={p.renovacionAuto}
                  onChange={(e) => update(p.id, { renovacionAuto: e.target.checked })}
                />
                Renovación automática
              </label>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs">
                <span className="text-slate-500">Tasa anual</span>
                <input
                  type="number"
                  step="0.001"
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                  value={p.tasaAnual}
                  onChange={(e) => update(p.id, { tasaAnual: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs">
                <span className="text-slate-500">Monto mínimo</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                  value={p.montoMin}
                  onChange={(e) => update(p.id, { montoMin: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs">
                <span className="text-slate-500">Penalización retiro</span>
                <input
                  type="number"
                  step="0.001"
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                  value={p.penalizacionRetiro}
                  onChange={(e) => update(p.id, { penalizacionRetiro: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs">
                <span className="text-slate-500">Impuesto aplicable</span>
                <input
                  type="number"
                  step="0.001"
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                  value={p.impuesto}
                  onChange={(e) => update(p.id, { impuesto: Number(e.target.value) })}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Plazos (meses): {p.plazoMeses.join(', ')} · Capitalización: {p.capitalizacion}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
