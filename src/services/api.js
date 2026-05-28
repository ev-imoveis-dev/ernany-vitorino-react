import axios from 'axios'
import { encerrarSessao } from './authService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  // Envia o cookie HttpOnly de sessao automaticamente em cada request.
  // Backend (CORS) precisa de credentials: true e origin allowlist.
  withCredentials: true,
})

const ROTAS_SEM_AUTO_LOGOUT = ['/auth/login', '/auth/trocar-senha', '/auth/esqueceu', '/auth/logout']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const ehRotaPublica = ROTAS_SEM_AUTO_LOGOUT.some(r => url.includes(r))
    if (error.response?.status === 401 && !ehRotaPublica) {
      encerrarSessao()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
