/**
 * Agrupa cobros indirectos en parámetros del motor de amortización.
 * @param {object[]} chargeDefs Definiciones completas de cargos
 * @param {string[]} selectedIds IDs seleccionados (producto + opcionales)
 * @param {number} principal Monto del préstamo
 */
export function resolveChargesForSimulation(chargeDefs, selectedIds, principal) {
  let fixedPerPeriod = 0
  let percentOfPrincipalPerPeriod = 0
  let upfrontFee = 0

  for (const id of selectedIds) {
    const c = chargeDefs.find((x) => x.id === id)
    if (!c) continue

    if (c.tipo === 'fijo') {
      if (c.frecuencia === 'mensual') fixedPerPeriod += c.valor
      else upfrontFee += c.valor
    } else {
      if (c.frecuencia === 'mensual') percentOfPrincipalPerPeriod += c.valor
      else upfrontFee += principal * c.valor
    }
  }

  return {
    charges: { fixedPerPeriod, percentOfPrincipalPerPeriod },
    upfrontFee,
  }
}
