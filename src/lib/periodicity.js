/** Payments per year */
export const PERIODICITY = {
  quincenal: 24,
  mensual: 12,
  bimestral: 6,
  trimestral: 4,
  semestral: 2,
  anual: 1,
}

export const PERIODICITY_LABELS = {
  quincenal: 'Quincenal',
  mensual: 'Mensual',
  bimestral: 'Bimestral',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
}

/**
 * @param {number} plazoMeses
 * @param {keyof typeof PERIODICITY} periodicity
 */
export function numberOfPayments(plazoMeses, periodicity) {
  const perYear = PERIODICITY[periodicity]
  if (!perYear) return Math.max(1, Math.round(plazoMeses))
  const monthsPerPayment = 12 / perYear
  return Math.max(1, Math.round(plazoMeses / monthsPerPayment))
}
