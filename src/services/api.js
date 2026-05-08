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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      encerrarSessao()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
