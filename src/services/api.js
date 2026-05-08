import axios from 'axios'
import { getToken, encerrarSessao } from './authService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const ROTAS_SEM_AUTO_LOGOUT = ['/auth/login', '/auth/trocar-senha', '/auth/esqueceu']

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
