/** @param {number} value */
export function formatCurrency(value, locale = 'es-EC', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
}

/** @param {number} rate Annual rate as decimal e.g. 0.12 for 12% */
export function formatPercent(rate) {
  return `${(rate * 100).toFixed(2)}%`
}
