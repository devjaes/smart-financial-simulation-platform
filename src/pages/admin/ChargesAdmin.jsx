import { motion } from 'framer-motion'
import { useCatalog } from '../../context/CatalogContext.jsx'

export default function ChargesAdmin() {
  const { charges, setCharges } = useCatalog()

  const update = (id, patch) => {
    setCharges(charges.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const add = () => {
    const id = `cargo_${crypto.randomUUID()}`
    setCharges([
      ...charges,
      {
        id,
        nombre: 'Nuevo cargo',
        tipo: 'fijo',
        valor: 0,
        frecuencia: 'mensual',
        naturaleza: 'opcional',
      },
    ])
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cobros indirectos</h1>
          <p className="mt-1 text-sm text-slate-600">Fijos o porcentuales; frecuencia y obligatoriedad.</p>
        </div>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--sfici-primary)' }}
          onClick={add}
        >
          Nuevo cobro
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Valor</th>
              <th className="px-3 py-2">Frecuencia</th>
              <th className="px-3 py-2">Naturaleza</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((c) => (
              <tr key={c.id} className="border-b border-slate-50">
                <td className="px-3 py-2">
                  <input
                    className="w-full max-w-xs rounded border border-slate-200 px-2 py-1"
                    value={c.nombre}
                    onChange={(e) => update(c.id, { nombre: e.target.value })}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-slate-200 px-2 py-1"
                    value={c.tipo}
                    onChange={(e) => update(c.id, { tipo: e.target.value })}
                  >
                    <option value="fijo">Fijo</option>
                    <option value="porcentual">Porcentual</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.0001"
                    className="w-28 rounded border border-slate-200 px-2 py-1"
                    value={c.valor}
                    onChange={(e) => update(c.id, { valor: Number(e.target.value) })}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-slate-200 px-2 py-1"
                    value={c.frecuencia}
                    onChange={(e) => update(c.id, { frecuencia: e.target.value })}
                  >
                    <option value="mensual">Mensual</option>
                    <option value="unico">Único</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-slate-200 px-2 py-1"
                    value={c.naturaleza}
                    onChange={(e) => update(c.id, { naturaleza: e.target.value })}
                  >
                    <option value="obligatorio">Obligatorio</option>
                    <option value="opcional">Opcional</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
