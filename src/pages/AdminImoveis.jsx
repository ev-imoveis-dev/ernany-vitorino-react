import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getImoveis, deleteImovel } from '../services/imovelService'
import { Pencil, Trash2, ArrowLeft, Home } from 'lucide-react'

export default function AdminImoveis() {
  const navigate = useNavigate()
  const [imoveis, setImoveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [confirmando, setConfirmando] = useState(null)

  const corretor = JSON.parse(localStorage.getItem('corretor_logado') || 'null')

  useEffect(() => {
    // if (!corretor) {
    //   navigate('/login')
    //   return
    // }
    getImoveis()
      .then(setImoveis)
      .catch(() => setErro('Não foi possível carregar os imóveis.'))
      .finally(() => setLoading(false))
  }, [])

//   if (!corretor) return null

  async function handleExcluir(id) {
    try {
      await deleteImovel(id)
      setImoveis(prev => prev.filter(item => item.id !== id))
      setConfirmando(null)
    } catch {
      alert('Erro ao excluir imóvel.')
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

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">

        <button onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-primary font-medium mb-6 hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> Voltar ao Dashboard
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-1 block">Painel Admin</span>
            <h1 className="text-4xl font-serif text-primary">Imóveis Cadastrados</h1>
          </div>
          <button onClick={() => navigate('/admin/cadastrar')}
            className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
            <Home size={16} /> Novo Imóvel
          </button>
        </div>

        {imoveis.length === 0 ? (
          <div className="bg-light p-20 rounded-2xl text-center">
            <p className="text-gray-400 text-lg">Nenhum imóvel cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {imoveis.map(item => (
              <div key={item.id}
                className="bg-light rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow">

                <img
                  src={item.imagem || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'}
                  alt={item.nome}
                  className="w-full sm:w-32 h-24 object-cover rounded-xl flex-shrink-0"
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80'}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-serif font-bold text-primary truncate">{item.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.localizacao}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    {' · '}
                    {new Date(item.criado_em).toLocaleDateString('pt-BR')}
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
                      <button
                        onClick={() => navigate(`/admin/editar/${item.id}`)}
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}