// src/pages/Imoveis.jsx

import { useEffect, useState } from 'react'
import { getImoveis } from '../services/imovelService'

export default function Imoveis() {
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getImoveis()
      .then(setImoveis)
      .catch(() => setErro('Não foi possível carregar os imóveis.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando...</p>
  if (erro)    return <p>{erro}</p>

  return (
    <ul>
      {imoveis.map(imovel => (
        <li key={imovel.id}>
          <strong>{imovel.nome}</strong> — R$ {imovel.valor}
        </li>
      ))}
    </ul>
  )
}