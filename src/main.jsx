import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'
import { InstitutionalProvider } from './context/InstitutionalContext.jsx'
import { ToastContainer } from './components/ui/Toast.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <InstitutionalProvider>
        <AuthProvider>
          <CatalogProvider>
            <HistoryProvider>
              <App />
              <ToastContainer />
            </HistoryProvider>
          </CatalogProvider>
        </AuthProvider>
      </InstitutionalProvider>
    </BrowserRouter>
  </StrictMode>,
)
