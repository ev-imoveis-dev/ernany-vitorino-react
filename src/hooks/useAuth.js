import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessao } from '../services/authService'

export function useAuth() {
  const navigate = useNavigate()
  const sessao = getSessao()

  useEffect(() => {
    if (!sessao) {
      navigate('/login')
    }
  }, [])

  return sessao
}