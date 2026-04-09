/**
 * Interés simple: I = P * r * t (t en años)
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} years
 */
export function simpleInterestMaturity(principal, annualRate, years) {
  const interest = principal * annualRate * years
  return {
    finalCapital: principal + interest,
    interestGenerated: interest,
    table: [{ period: 0, capital: principal, interest: 0, accumulated: principal }],
  }
}

/**
 * Interés compuesto con aportes periódicos al inicio de cada período (simplificado).
 * @param {object} p
 * @param {number} p.initialCapital
 * @param {number} p.annualRate
 * @param {number} p.years
 * @param {number} p.paymentsPerYear
 * @param {number} p.periodicContribution Aporte por período
 */
export function compoundWithContributions({
  initialCapital,
  annualRate,
  years,
  paymentsPerYear,
  periodicContribution,
}) {
  const n = Math.round(years * paymentsPerYear)
  const ratePerPeriod = annualRate / paymentsPerYear
  let balance = initialCapital
  /** @type {{ period: number, capital: number, interest: number, accumulated: number }[]} */
  const table = [{ period: 0, capital: initialCapital, interest: 0, accumulated: initialCapital }]

  for (let k = 1; k <= n; k++) {
    balance += periodicContribution
    const interest = balance * ratePerPeriod
    balance += interest
    table.push({
      period: k,
      capital: periodicContribution,
      interest,
      accumulated: balance,
    })
  }

  const interestGenerated = balance - initialCapital - periodicContribution * n
  return {
    finalCapital: balance,
    interestGenerated,
    table,
    periods: n,
  }
}

/**
 * Comparación simple vs compuesto (mismo capital inicial, sin aportes extra en simple extendido).
 */
export function compareSimpleVsCompound(initialCapital, annualRate, years, paymentsPerYear = 12) {
  const simple = simpleInterestMaturity(initialCapital, annualRate, years)
  const compound = compoundWithContributions({
    initialCapital,
    annualRate,
    years,
    paymentsPerYear,
    periodicContribution: 0,
  })
  return { simple, compound }
}
