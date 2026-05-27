import { useState, useEffect } from 'react'
import { listarCorretores } from '../services/corretorService'

export function useCorretores() {
  const [corretores, setCorretores] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarCorretores()
      .then(({ dados }) => setCorretores(Array.isArray(dados) ? dados : []))
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [])

  return { corretores, setCorretores, carregando }
}
