import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'sfici_history_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [items, setItems] = useState(load)

  const value = useMemo(
    () => ({
      items,
      add: (entry) => {
        setItems((prev) => {
          const next = [entry, ...prev].slice(0, 200)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          return next
        })
      },
      updateStatus: (id, estado) => {
        setItems((prev) => {
          const next = prev.map((x) => (x.id === id ? { ...x, estado } : x))
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          return next
        })
      },
    }),
    [items],
  )

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory dentro de HistoryProvider')
  return ctx
}
