import { useState, useEffect, useCallback } from 'react'
import { getImoveisPaginado } from '../services/imovelService'

export function useFetchImoveis(params) {
  const [imoveis, setImoveis] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [recarga, setRecarga] = useState(0)

  const paramsKey = JSON.stringify(params ?? null)

  const recarregar = useCallback(() => setRecarga(n => n + 1), [])

  useEffect(() => {
    let cancelled = false
    getImoveisPaginado(params)
      .then(resposta => {
        if (cancelled) return
        setImoveis(resposta.dados || [])
        setTotal(resposta.total ?? 0)
        setTotalPaginas(resposta.totalPaginas ?? 0)
        setErro(null)
      })
      .catch(e => { if (!cancelled) setErro(e?.message || 'Não foi possível carregar os imóveis.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, recarga])

  return { imoveis, setImoveis, total, totalPaginas, loading, erro, recarregar }
}
