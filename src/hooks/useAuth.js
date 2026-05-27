import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessao } from '../services/authService'

export function useAuth() {
  const navigate = useNavigate()
  const sessao = useMemo(() => getSessao(), [])

  useEffect(() => {
    if (!sessao) {
      navigate('/login')
    } else if (sessao.trocar_senha) {
      navigate('/trocar-senha')
    }
  }, [sessao, navigate])

  return sessao
}
