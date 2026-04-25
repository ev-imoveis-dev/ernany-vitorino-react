import { useEffect, useState } from 'react'
import { getImoveis } from '../services/imovelService'
import PropertyCard from '../components/PropertyCard'
import { Home } from 'lucide-react'

const FILTROS = [
  { label: 'Todos', value: '' },
  { label: 'Venda', value: 'venda' },
  { label: 'Aluguel', value: 'aluguel' },
]

export default function Imoveis() {
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtro, setFiltro] = useState('')

  useEffect(() => {
    setLoading(true)
    setErro(null)
    getImoveis(filtro)
      .then(setImoveis)
      .catch(() => setErro('Não foi possível carregar os imóveis.'))
      .finally(() => setLoading(false))
  }, [filtro])

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        {/* Título */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Portfólio
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            Imóveis Disponíveis
          </h1>
          <p className="text-gray-500 text-lg">
            Encontre o imóvel ideal para você.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center gap-3 mb-12">
          {FILTROS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFiltro(value)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                filtro === value
                  ? 'bg-primary text-white'
                  : 'bg-light text-gray-500 hover:bg-primary/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Estados */}
        {loading && (
          <div className="text-center py-24 text-gray-400">Carregando imóveis...</div>
        )}

        {erro && (
          <div className="text-center py-24 text-red-500">{erro}</div>
        )}

        {!loading && !erro && imoveis.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Home size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nenhum imóvel encontrado.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !erro && imoveis.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {imoveis.map(imovel => (
              <PropertyCard key={imovel.id} property={imovel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}