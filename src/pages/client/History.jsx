import { motion } from 'framer-motion'
import { useHistory } from '../../context/HistoryContext.jsx'
import { formatCurrency } from '../../lib/currency.js'

const estados = ['Simulado', 'Preaprobado', 'Rechazado', 'Enviado a revisión']

export default function History() {
  const { items, updateStatus } = useHistory()

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Historial de simulaciones</h1>
        <p className="mt-1 text-sm text-slate-600">Registro local con trazabilidad básica.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Usuario</th>
              <th className="px-3 py-2">Producto</th>
              <th className="px-3 py-2">Monto</th>
              <th className="px-3 py-2">Método</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  No hay simulaciones guardadas. Ejecute una simulación y pulse «Guardar en historial».
                </td>
              </tr>
            )}
            {items.map((row) => (
              <tr key={row.id} className="border-b border-slate-50">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-600">
                  {new Date(row.fecha).toLocaleString('es-EC')}
                </td>
                <td className="px-3 py-2 text-xs">{row.usuario}</td>
                <td className="px-3 py-2">{row.tipoCredito}</td>
                <td className="px-3 py-2">{formatCurrency(row.monto)}</td>
                <td className="px-3 py-2">{row.metodo === 'frances' ? 'Francés' : 'Alemán'}</td>
                <td className="px-3 py-2">{formatCurrency(row.totalPagar)}</td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-slate-200 px-2 py-1 text-xs"
                    value={row.estado}
                    onChange={(e) => updateStatus(row.id, e.target.value)}
                  >
                    {estados.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
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
