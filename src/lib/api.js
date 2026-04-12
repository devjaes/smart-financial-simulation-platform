function getBaseUrl() {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return ''
  return String(raw).replace(/\/+$/, '')
}

function getToken() {
  try {
    return localStorage.getItem('sfici_token')
  } catch {
    return null
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const url = `${getBaseUrl()}${path}`
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let payload
    try {
      payload = await res.json()
    } catch {
      payload = { error: await res.text() }
    }
    const msg = payload?.error || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    err.payload = payload
    throw err
  }
  return await res.json()
}

export const api = {
  health: () => request('/api/health', { auth: false }),

  // Auth
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (data) =>
    request('/api/auth/register', { method: 'POST', body: data, auth: false }),
  getMe: () => request('/api/auth/me'),

  // Catalog (GET is public)
  getCatalog: () => request('/api/catalog', { auth: false }),
  putCatalog: (catalog) => request('/api/catalog', { method: 'PUT', body: catalog }),

  // Institution (GET is public)
  getInstitutionProfile: () => request('/api/institution/profile', { auth: false }),
  putInstitutionProfile: (profile) =>
    request('/api/institution/profile', { method: 'PUT', body: profile }),

  // History
  listHistory: (limit = 200) => request(`/api/history?limit=${encodeURIComponent(limit)}`),
  addHistory: (entry) => request('/api/history', { method: 'POST', body: entry }),
  patchHistoryStatus: (id, estado) =>
    request(`/api/history/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: { estado },
    }),

  // Requests
  createRequest: (data) => request('/api/requests', { method: 'POST', body: data }),
  getRequests: (limit = 100) => request(`/api/requests?limit=${encodeURIComponent(limit)}`),
  getRequest: (id) => request(`/api/requests/${encodeURIComponent(id)}`),
  reviewRequest: (id, body) => request(`/api/requests/${encodeURIComponent(id)}/review`, { method: 'PATCH', body }),
  getRequestsByCedula: (cedula) => request(`/api/requests/by-cedula/${encodeURIComponent(cedula)}`),
}
