import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { PERIODICITY_LABELS } from '../../lib/periodicity.js'

export default function CreditProductsAdmin() {
  const { creditProducts, setCreditProducts } = useCatalog()
  const [editingId, setEditingId] = useState(null)

  const update = (id, patch) => {
    setCreditProducts(creditProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const remove = (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    setCreditProducts(creditProducts.filter((p) => p.id !== id))
  }

  const duplicate = (p) => {
    const copy = {
      ...p,
      id: `${p.id}_copy_${crypto.randomUUID()}`,
      nombre: `${p.nombre} (copia)`,
    }
    setCreditProducts([...creditProducts, copy])
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tipos de crédito</h1>
          <p className="mt-1 text-sm text-slate-600">Alta, edición y estado activo/inactivo.</p>
        </div>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm"
          style={{ backgroundColor: 'var(--sfici-primary)' }}
          onClick={() => {
            const id = `nuevo_${crypto.randomUUID()}`
            setCreditProducts([
              ...creditProducts,
              {
                id,
                nombre: 'Nuevo producto',
                tasaAnual: 0.12,
                tasaMoratoria: 0.24,
                montoMin: 1000,
                montoMax: 50000,
                plazoMinMeses: 12,
                plazoMaxMeses: 60,
                periodicidades: ['mensual'],
                porcentajeEntrada: 0,
                cobrosIds: [],
                activo: true,
              },
            ])
            setEditingId(id)
          }}
        >
          Nuevo producto
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Tasa anual</th>
              <th className="px-3 py-2">Montos</th>
              <th className="px-3 py-2">Plazo (meses)</th>
              <th className="px-3 py-2">Activo</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {creditProducts.map((p) => (
              <tr key={p.id} className="border-b border-slate-50">
                <td className="px-3 py-2">
                  {editingId === p.id ? (
                    <input
                      className="w-full rounded border border-slate-200 px-2 py-1"
                      value={p.nombre}
                      onChange={(e) => update(p.id, { nombre: e.target.value })}
                    />
                  ) : (
                    <span className="font-medium text-slate-800">{p.nombre}</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.001"
                    className="w-24 rounded border border-slate-200 px-2 py-1"
                    value={p.tasaAnual}
                    onChange={(e) => update(p.id, { tasaAnual: Number(e.target.value) })}
                  />
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {p.montoMin} – {p.montoMax}
                </td>
                <td className="px-3 py-2 text-xs">
                  {p.plazoMinMeses} – {p.plazoMaxMeses}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={p.activo}
                    onChange={(e) => update(p.id, { activo: e.target.checked })}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="text-sky-600 hover:underline"
                    onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                  >
                    {editingId === p.id ? 'Listo' : 'Editar'}
                  </button>
                  <button type="button" className="ml-2 text-slate-500 hover:underline" onClick={() => duplicate(p)}>
                    Duplicar
                  </button>
                  <button type="button" className="ml-2 text-red-600 hover:underline" onClick={() => remove(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Periodicidades admitidas: {Object.keys(PERIODICITY_LABELS).join(', ')}. Vincule cobros desde el módulo de
        cobros indirectos usando los IDs en datos (avanzado) o edite el arreglo en código si requiere más precisión.
      </p>
    </motion.div>
  )
}
