import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CatalogProvider } from './context/CatalogContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'
import { InstitutionalProvider } from './context/InstitutionalContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <InstitutionalProvider>
        <CatalogProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </CatalogProvider>
      </InstitutionalProvider>
    </BrowserRouter>
  </StrictMode>,
)
