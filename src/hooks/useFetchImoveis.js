import { useState, useEffect } from 'react'
import { getImoveis } from '../services/imovelService'

export function useFetchImoveis(params) {
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  const paramsKey = JSON.stringify(params ?? null)

  useEffect(() => {
    let cancelled = false
    getImoveis(params)
      .then(dados => { if (!cancelled) setImoveis(dados || []) })
      .catch(e => { if (!cancelled) setErro(e?.message || 'Não foi possível carregar os imóveis.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey])

  return { imoveis, setImoveis, loading, erro }
}
