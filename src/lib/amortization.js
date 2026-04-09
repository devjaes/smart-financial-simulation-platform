import { PERIODICITY, numberOfPayments } from './periodicity.js'

/**
 * @typedef {'frances' | 'aleman'} AmortizationMethod
 * @typedef {import('./periodicity.js').PERIODICITY[keyof import('./periodicity.js').PERIODICITY]} PeriodicityKey
 */

/**
 * @typedef {Object} ScheduleRow
 * @property {number} period
 * @property {number} payment Cuota total del período
 * @property {number} interest Interés del período
 * @property {number} principal Capital amortizado
 * @property {number} balance Saldo pendiente tras el pago
 */

/**
 * @typedef {Object} AmortizationResult
 * @property {ScheduleRow[]} schedule
 * @property {number} periodicRate Tasa por período
 * @property {number} totalPaid
 * @property {number} totalInterest
 * @property {number} totalPrincipal
 * @property {number} totalCharges
 * @property {number} firstPayment
 */

/**
 * Extra charges applied each period (sum of fixed + % of outstanding balance if modeled simply).
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} n
 * @param {{ fixedPerPeriod: number, percentOfPrincipalPerPeriod: number }} charges
 */
function periodicExtraCharges(principal, annualRate, n, charges) {
  const fixed = charges.fixedPerPeriod || 0
  const pct = principal * (charges.percentOfPrincipalPerPeriod || 0)
  return fixed + pct
}

/**
 * @param {Object} input
 * @param {number} input.principal Monto neto después de entrada
 * @param {number} input.annualRate Tasa anual efectiva (ej. 0.115)
 * @param {number} input.plazoMeses Plazo total en meses
 * @param {keyof typeof import('./periodicity.js').PERIODICITY} input.periodicity
 * @param {AmortizationMethod} input.method
 * @param {{ fixedPerPeriod: number, percentOfPrincipalPerPeriod: number }} [input.charges]
 * @param {number} [input.upfrontFee] Cargo único en la primera cuota (comisiones tipo único)
 */
export function buildSchedule(input) {
  const {
    principal,
    annualRate,
    plazoMeses,
    periodicity,
    method,
    charges = { fixedPerPeriod: 0, percentOfPrincipalPerPeriod: 0 },
    upfrontFee = 0,
  } = input

  const n = numberOfPayments(plazoMeses, periodicity)
  const paymentsPerYear = PERIODICITY[periodicity] || 12
  const periodicRate = annualRate / paymentsPerYear

  const extra = (balance, periodIndex) =>
    periodicExtraCharges(principal, annualRate, n, charges) + (periodIndex === 1 ? upfrontFee : 0)

  /** @type {ScheduleRow[]} */
  const schedule = []
  let balance = principal
  let totalInterest = 0
  let totalChargesAcc = 0

  if (method === 'frances') {
    let paymentCore
    if (periodicRate <= 0) {
      paymentCore = principal / n
    } else {
      const factor = periodicRate * (1 + periodicRate) ** n
      const denom = (1 + periodicRate) ** n - 1
      paymentCore = (principal * factor) / denom
    }

    for (let k = 1; k <= n; k++) {
      const interest = balance * periodicRate
      const add = extra(balance, k)
      totalChargesAcc += add
      let principalPart = paymentCore - interest
      let payment = paymentCore + add
      if (k === n) {
        principalPart = balance
        payment = interest + principalPart + add
      }
      balance = Math.max(0, balance - principalPart)
      totalInterest += interest
      schedule.push({
        period: k,
        payment,
        interest,
        principal: principalPart,
        balance,
      })
    }
  } else {
    const principalPerPeriod = principal / n
    for (let k = 1; k <= n; k++) {
      const interest = balance * periodicRate
      let pp = principalPerPeriod
      if (k === n) pp = balance
      const add = extra(balance, k)
      totalChargesAcc += add
      const payment = pp + interest + add
      balance = Math.max(0, balance - pp)
      totalInterest += interest
      schedule.push({
        period: k,
        payment,
        interest,
        principal: pp,
        balance,
      })
    }
  }

  const sumPayments = schedule.reduce((s, r) => s + r.payment, 0)

  return {
    schedule,
    periodicRate,
    totalPaid: sumPayments,
    totalInterest,
    totalPrincipal: principal,
    totalCharges: totalChargesAcc,
    firstPayment: schedule[0]?.payment ?? 0,
    periods: n,
  }
}

/**
 * @param {Parameters<typeof buildSchedule>[0]} baseInput
 */
export function compareMethods(baseInput) {
  const french = buildSchedule({ ...baseInput, method: 'frances' })
  const german = buildSchedule({ ...baseInput, method: 'aleman' })

  const lowerInterest =
    french.totalInterest < german.totalInterest
      ? 'frances'
      : german.totalInterest < french.totalInterest
        ? 'aleman'
        : 'empate'
  const lowerFirstPayment =
    french.firstPayment < german.firstPayment
      ? 'frances'
      : german.firstPayment < french.firstPayment
        ? 'aleman'
        : 'empate'
  /** Cuotas constantes = más estable (francés) */
  const moreStable = 'frances'

  /** @type {string[]} */
  const alerts = []
  alerts.push(
    'El método alemán presenta cuotas más altas al inicio, pero suele reducir el costo total en intereses frente al francés, con mismos parámetros.',
  )
  alerts.push(
    'El método francés mantiene cuotas constantes (capital+interés base), facilitando la planificación del flujo de caja.',
  )

  if (lowerInterest === 'aleman') {
    alerts.push('Con los datos ingresados, el método alemán acumula menos intereses que el francés.')
  } else if (lowerInterest === 'frances') {
    alerts.push(
      'Con los datos ingresados, el método francés muestra menor o igual interés total (caso atípico; verifique redondeos).',
    )
  } else {
    alerts.push('Ambos métodos acumulan el mismo interés total con estos parámetros.')
  }

  let recommendation =
    'Perfil conservador / flujo predecible: favorece el método francés. Perfil que prioriza menor costo financiero total: evaluar el método alemán.'
  if (german.totalInterest < french.totalInterest && german.firstPayment > french.firstPayment * 1.05) {
    recommendation =
      'Si puede afrontar cuotas iniciales más altas, el método alemán reduce intereses; si necesita estabilidad de cuota, el francés es más adecuado.'
  }

  return {
    french,
    german,
    lowerInterest,
    lowerFirstPayment,
    moreStable,
    recommendation,
    alerts,
  }
}
