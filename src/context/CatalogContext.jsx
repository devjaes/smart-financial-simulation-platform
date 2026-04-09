import { createContext, useContext, useMemo, useState } from 'react'
import {
  DEFAULT_CHARGES,
  DEFAULT_CREDIT_PRODUCTS,
  DEFAULT_INVESTMENT_PRODUCTS,
} from '../data/catalogs.js'

const KEY = 'sfici_catalog_v1'

function loadCatalog() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      return {
        creditProducts: DEFAULT_CREDIT_PRODUCTS,
        charges: DEFAULT_CHARGES,
        investmentProducts: DEFAULT_INVESTMENT_PRODUCTS,
      }
    }
    const p = JSON.parse(raw)
    return {
      creditProducts: p.creditProducts ?? DEFAULT_CREDIT_PRODUCTS,
      charges: p.charges ?? DEFAULT_CHARGES,
      investmentProducts: p.investmentProducts ?? DEFAULT_INVESTMENT_PRODUCTS,
    }
  } catch {
    return {
      creditProducts: DEFAULT_CREDIT_PRODUCTS,
      charges: DEFAULT_CHARGES,
      investmentProducts: DEFAULT_INVESTMENT_PRODUCTS,
    }
  }
}

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(loadCatalog)

  const persist = (next) => {
    setCatalog(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  const value = useMemo(
    () => ({
      creditProducts: catalog.creditProducts,
      charges: catalog.charges,
      investmentProducts: catalog.investmentProducts,
      setCreditProducts: (creditProducts) => persist({ ...catalog, creditProducts }),
      setCharges: (charges) => persist({ ...catalog, charges }),
      setInvestmentProducts: (investmentProducts) => persist({ ...catalog, investmentProducts }),
      resetCatalog: () => {
        localStorage.removeItem(KEY)
        setCatalog({
          creditProducts: DEFAULT_CREDIT_PRODUCTS,
          charges: DEFAULT_CHARGES,
          investmentProducts: DEFAULT_INVESTMENT_PRODUCTS,
        })
      },
    }),
    [catalog],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog dentro de CatalogProvider')
  return ctx
}
