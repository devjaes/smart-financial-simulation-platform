import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import Landing from './pages/Landing.jsx'
import AdminHome from './pages/admin/AdminHome.jsx'
import ChargesAdmin from './pages/admin/ChargesAdmin.jsx'
import CreditProductsAdmin from './pages/admin/CreditProductsAdmin.jsx'
import InstitutionalConfig from './pages/admin/InstitutionalConfig.jsx'
import InvestmentProductsAdmin from './pages/admin/InvestmentProductsAdmin.jsx'
import ClientHome from './pages/client/ClientHome.jsx'
import CreditSimulation from './pages/client/CreditSimulation.jsx'
import History from './pages/client/History.jsx'
import InvestmentSimulation from './pages/client/InvestmentSimulation.jsx'
import RequestFlow from './pages/client/RequestFlow.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<AppShell mode="admin" />}>
        <Route index element={<AdminHome />} />
        <Route path="config" element={<InstitutionalConfig />} />
        <Route path="creditos" element={<CreditProductsAdmin />} />
        <Route path="cobros" element={<ChargesAdmin />} />
        <Route path="inversiones" element={<InvestmentProductsAdmin />} />
      </Route>
      <Route path="/cliente" element={<AppShell mode="client" />}>
        <Route index element={<ClientHome />} />
        <Route path="simulacion" element={<CreditSimulation />} />
        <Route path="inversion" element={<InvestmentSimulation />} />
        <Route path="historial" element={<History />} />
        <Route path="solicitud" element={<RequestFlow />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
