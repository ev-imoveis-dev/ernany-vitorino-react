import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getImoveis, deleteImovel } from '../services/imovelService'
import { Pencil, Trash2, ArrowLeft, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSessao } from '../services/authService'

export default function AdminImoveis() {
  const navigate = useNavigate()
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [buscaRef, setBuscaRef] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => { setPagina(1) }, [buscaRef])
  const POR_PAGINA = 10

  const sessao = useMemo(() => getSessao(), [])
  const papel = String(sessao?.usuario?.papel || '').toLowerCase()
  const prefixo = papel === 'admin' ? '/admin' : '/corretor'

  useEffect(() => {
    if (!sessao) {
      navigate('/login')
      return
    }

    const papel = String(sessao.usuario?.papel || '').toLowerCase()
    const usuarioId = sessao.usuario?.id

    setLoading(true)
    setErro(null)

    const carregar = async () => {
      try {
        const dados = papel === 'corretor'
          ? await getImoveis({ corretorId: usuarioId })
          : await getImoveis()
        setImoveis(dados || [])
      } catch (e) {
        setErro(papel === 'corretor'
          ? 'Não foi possível carregar os imóveis do corretor.'
          : 'Não foi possível carregar os imóveis.')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [navigate, sessao]) 

  async function handleExcluir(id) {
    try {
      await deleteImovel(id)
      setImoveis(prev => prev.filter(item => item.id !== id))
      setConfirmando(null)
      toast.success('Imóvel removido com sucesso.')
    } catch (err) {
      toast.error(err?.message || 'Erro ao excluir imóvel.')
    }
  }

  if (loading) return (
    <div className="pt-32 pb-24 bg-white min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Carregando imóveis...</p>
    </div>
  )

  if (erro) return (
    <div className="pt-32 pb-24 bg-white min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-lg">{erro}</p>
    </div>
  )

  const podeEditarOuDeletar = (item) => {
    if (!sessao || !sessao.usuario) return false
    const papel = String(sessao.usuario.papel || '').toLowerCase()
    const usuarioId = String(sessao.usuario.id)
    if (papel === 'admin') return true
    if (item.corretor_id && String(item.corretor_id) === usuarioId) return true
    return false
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">

        <button onClick={() => navigate(prefixo)}
          className="flex items-center gap-2 text-primary font-medium mb-6 hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> Voltar ao Dashboard
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-1 block">Painel Admin</span>
            <h1 className="text-4xl font-serif text-primary">Imóveis Cadastrados</h1>
          </div>
          <button onClick={() => navigate(`${prefixo}/cadastrar`)}
            className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
            <Home size={16} /> Novo Imóvel
          </button>
        </div>

        {/* Busca por referência */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por código de referência..."
              value={buscaRef}
              onChange={e => setBuscaRef(e.target.value)}
              className="w-full bg-light border border-gray-100 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </span>
            {buscaRef && (
              <button onClick={() => setBuscaRef('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
        </div>

        {imoveis.length === 0 ? (
          <div className="bg-light p-20 rounded-2xl text-center">
            <p className="text-gray-400 text-lg">Nenhum imóvel cadastrado ainda.</p>
          </div>
        ) : (() => {
          const imoveisFiltrados = buscaRef
            ? imoveis.filter(item => item.referencia?.toLowerCase().includes(buscaRef.toLowerCase()))
            : imoveis
          const totalPaginas = Math.ceil(imoveisFiltrados.length / POR_PAGINA)
          const paginaAtual = Math.min(pagina, totalPaginas || 1)
          const paginados = imoveisFiltrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

          return imoveisFiltrados.length === 0 ? (
            <div className="bg-light p-20 rounded-2xl text-center">
              <p className="text-gray-400 text-lg">Nenhum imóvel com referência "<strong>{buscaRef}</strong>".</p>
            </div>
          ) : (
            <>
            <p className="text-sm text-gray-400 mb-4">{imoveisFiltrados.length} imóvel{imoveisFiltrados.length !== 1 ? 'is' : ''} encontrado{imoveisFiltrados.length !== 1 ? 's' : ''}</p>
            <div className="space-y-4">
              {paginados.map(item => (
                <div key={item.id}
                  className="bg-light rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow">

                  <img
                    src={item.imagem || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'}
                    alt={item.nome}
                    className="w-full sm:w-32 h-24 object-cover rounded-xl flex-shrink-0"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-serif font-bold text-primary truncate">{item.nome}</h3>
                      {item.referencia && (
                        <span className="text-gray-400 text-xs font-mono bg-white px-3 py-1 rounded-full border border-gray-200 whitespace-nowrap shrink-0">
                          {item.referencia}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.localizacao}</p>
          
                    <p>
                      {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    {confirmando === item.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Confirmar?</span>
                        <button onClick={() => handleExcluir(item.id)}
                          className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors">
                          Sim
                        </button>
                        <button onClick={() => setConfirmando(null)}
                          className="bg-white border border-gray-200 text-gray-500 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                          Não
                        </button>
                      </div>
                    ) : (
                      <>
                        {podeEditarOuDeletar(item) ? (
                          <>
                            <button
                              onClick={() => navigate(`${prefixo}/editar/${item.id}`)}
                              className="flex flex-col items-center gap-1 border-2 border-blue-400 text-blue-400 rounded-xl p-3 hover:bg-blue-50 transition-colors"
                            >
                              <Pencil size={18} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Editar</span>
                            </button>
                            <button
                              onClick={() => setConfirmando(item.id)}
                              className="flex flex-col items-center gap-1 border-2 border-red-400 text-red-400 rounded-xl p-3 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={18} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Remover</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center text-sm text-gray-400 px-3 py-2 rounded-xl border border-gray-100">
                            Sem permissão
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="w-10 h-10 rounded-xl bg-light border border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setPagina(num)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      paginaAtual === num
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-light border border-gray-100 text-gray-500 hover:bg-primary hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="w-10 h-10 rounded-xl bg-light border border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            </>
          )
        })()}
      </div>
    </div>
  )
}