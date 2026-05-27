import React, { useState, useMemo, useEffect, useReducer } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getImoveis } from '../services/imovelService'
import PropertyCard from '../components/PropertyCard'
import { Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

const FILTROS_INICIAIS = {
  tipo: 'todos',
  tipo_imovel: 'Todos',
  localizacao: '',
  quartos: 'Todos',
  ordem: 'recentes'
}

const POR_PAGINA = 6

// ← fora do PropertyList para não recriar a cada render
const PainelFiltros = ({ filters, onFilter, onLimpar }) => (
  <div className="space-y-6">

    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Finalidade
      </label>
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Todos', value: 'todos' },
          { label: 'Venda', value: 'venda' },
          { label: 'Aluguel', value: 'aluguel' },
        ].map(({ label, value }) => (
          <button key={value} onClick={() => onFilter('tipo', value)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filters.tipo === value ? 'bg-primary text-white' : 'bg-light text-gray-500 hover:bg-gray-200')}>
            {label}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Tipo de Imóvel
      </label>
      <select value={filters.tipo_imovel} onChange={e => onFilter('tipo_imovel', e.target.value)}
        className="w-full bg-light p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary">
        <option value="Todos">Todos os tipos</option>
        {['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial'].map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Localização
      </label>
      <input
        type="text"
        placeholder="Ex: Praia do Morro"
        value={filters.localizacao}
        onChange={e => onFilter('localizacao', e.target.value)}
        className="w-full bg-light p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Quartos
      </label>
      <div className="flex flex-wrap gap-2">
        {['Todos', '1', '2', '3', '4+'].map(op => (
          <button key={op} onClick={() => onFilter('quartos', op)}
            className={cn('w-10 h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center',
              filters.quartos === op ? 'bg-primary text-white' : 'bg-light text-gray-500 hover:bg-gray-200')}>
            {op}
          </button>
        ))}
      </div>
    </div>

    <button onClick={onLimpar}
      className="w-full py-3 text-sm font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">
      Limpar Filtros
    </button>
  </div>
)

function filtrosReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { filters: { ...state.filters, [action.name]: action.value }, pagina: 1 }
    case 'SET_PAGINA':
      return { ...state, pagina: action.pagina }
    case 'RESET':
      return { filters: FILTROS_INICIAIS, pagina: 1 }
    default:
      return state
  }
}

export default function PropertyList() {
  const location = useLocation()
  const navigate = useNavigate()
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  const [{ filters, pagina }, dispatch] = useReducer(filtrosReducer, null, () => {
    const params = new URLSearchParams(location.search)
    return {
      filters: {
        tipo: params.get('tipo') || FILTROS_INICIAIS.tipo,
        tipo_imovel: params.get('tipo_imovel') || FILTROS_INICIAIS.tipo_imovel,
        localizacao: params.get('localizacao') || FILTROS_INICIAIS.localizacao,
        quartos: params.get('quartos') || FILTROS_INICIAIS.quartos,
        ordem: params.get('ordem') || FILTROS_INICIAIS.ordem,
      },
      pagina: parseInt(params.get('pagina') || '1', 10),
    }
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getImoveis()
      .then(setImoveis)
      .catch(() => setErro('Não foi possível carregar os imóveis.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.tipo !== FILTROS_INICIAIS.tipo) params.set('tipo', filters.tipo)
    if (filters.tipo_imovel !== FILTROS_INICIAIS.tipo_imovel) params.set('tipo_imovel', filters.tipo_imovel)
    if (filters.localizacao) params.set('localizacao', filters.localizacao)
    if (filters.quartos !== FILTROS_INICIAIS.quartos) params.set('quartos', filters.quartos)
    if (filters.ordem !== FILTROS_INICIAIS.ordem) params.set('ordem', filters.ordem)
    if (pagina > 1) params.set('pagina', pagina)
    navigate({ search: params.toString() }, { replace: true })
  }, [filters, pagina, navigate])


const filtrados = useMemo(() => {
    return imoveis
      .filter(item => {
        const matchTipo = filters.tipo === 'todos' || item.tipo === filters.tipo
        const matchTipoImovel = filters.tipo_imovel === 'Todos' || item.tipo_imovel === filters.tipo_imovel
        const matchLocal = filters.localizacao === '' || item.localizacao?.toLowerCase().includes(filters.localizacao.toLowerCase())
        const matchQuartos = filters.quartos === 'Todos'
          || (filters.quartos === '4+' ? item.quartos >= 4 : item.quartos === parseInt(filters.quartos))
        return matchTipo && matchTipoImovel && matchLocal && matchQuartos
      })
      .sort((a, b) => {
        if (filters.ordem === 'menor_preco') return a.valor - b.valor
        if (filters.ordem === 'maior_preco') return b.valor - a.valor
        return b.id - a.id
      })
  }, [imoveis, filters])

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA)
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  function handleFilter(name, value) {
    dispatch({ type: 'SET_FILTER', name, value })
  }

  function limparFiltros() {
    dispatch({ type: 'RESET' })
  }

  if (loading) return (
    <div className="pt-32 pb-24 bg-light min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Carregando imóveis...</p>
    </div>
  )

  if (erro) return (
    <div className="pt-32 pb-24 bg-light min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-lg">{erro}</p>
    </div>
  )

  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <div className="container mx-auto px-4">

        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-2">Nossos Imóveis</h1>
            <p className="text-gray-500">{filtrados.length} imóveis encontrados</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 self-start md:self-auto">
            <span className="text-sm text-gray-400 font-medium">ORDENAR POR:</span>
            <select
              value={filters.ordem}
              onChange={(e) => handleFilter('ordem', e.target.value)}
              className="bg-transparent font-bold text-primary focus:outline-none cursor-pointer"
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor_preco">Menor preço</option>
              <option value="maior_preco">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Barra mobile */}
        <div className="lg:hidden flex gap-4 mb-8">
          <button onClick={() => setIsFilterOpen(true)}
            className="flex-1 bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-2 font-bold text-primary">
            <Filter size={20} className="text-secondary" />
            FILTRAR
          </button>
          <div className="flex-1 bg-white p-4 rounded-xl shadow-sm flex items-center justify-center">
            <select value={filters.ordem} onChange={e => handleFilter('ordem', e.target.value)}
              className="bg-transparent font-bold text-primary focus:outline-none w-full text-center">
              <option value="recentes">RECENTES</option>
              <option value="menor_preco">MENOR PREÇO</option>
              <option value="maior_preco">MAIOR PREÇO</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
                <SlidersHorizontal size={20} className="text-secondary" />
                <h3 className="text-lg font-bold text-primary uppercase tracking-widest">Filtros</h3>
              </div>
              <PainelFiltros
                filters={filters}
                onFilter={handleFilter}
                onLimpar={limparFiltros}
              />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {paginados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginados.map(item => (
                  <PropertyCard key={item.id} property={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-2xl text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter size={32} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-serif text-primary mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros para encontrar o que procura.</p>
              </div>
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => dispatch({ type: 'SET_PAGINA', pagina: Math.max(1, pagina - 1) })} disabled={pagina === 1}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                  <button key={num} onClick={() => dispatch({ type: 'SET_PAGINA', pagina: num })}
                    className={cn('w-10 h-10 rounded-xl text-sm font-bold transition-all',
                      pagina === num
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-white border border-gray-100 shadow-sm text-gray-500 hover:bg-primary hover:text-white hover:border-primary'
                    )}>
                    {num}
                  </button>
                ))}

                <button onClick={() => dispatch({ type: 'SET_PAGINA', pagina: Math.min(totalPaginas, pagina + 1) })} disabled={pagina === totalPaginas}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-serif text-primary">Filtros</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-light rounded-full">
                  <X size={24} />
                </button>
              </div>
              <PainelFiltros
                filters={filters}
                onFilter={handleFilter}
                onLimpar={limparFiltros}
              />
              <button onClick={() => setIsFilterOpen(false)}
                className="w-full bg-secondary text-primary font-bold py-5 rounded-xl shadow-xl shadow-secondary/20 mt-8">
                VER {filtrados.length} RESULTADOS
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}