import { useMemo } from 'react'
import { getSessao } from '../services/authService'

export function useSessionRole() {
  const sessao = useMemo(() => getSessao(), [])
  const papel = String(sessao?.usuario?.papel || '').toLowerCase()
  const usuarioId = String(sessao?.usuario?.id || '')
  const prefixo = papel === 'admin' ? '/admin' : '/corretor'
  return { sessao, papel, usuarioId, prefixo }
}
