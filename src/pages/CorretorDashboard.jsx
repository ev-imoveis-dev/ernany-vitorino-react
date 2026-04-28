import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, List, LogOut } from 'lucide-react'
import { encerrarSessao, getSessao } from '../services/authService'

const cards = [
  {
    icon: List,
    titulo: 'Meus Imóveis',
    descricao: 'Visualize, edite ou remova seus imóveis cadastrados.',
    rota: '/corretor/imoveis',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: Home,
    titulo: 'Cadastrar Imóvel',
    descricao: 'Adicione um novo imóvel ao sistema.',
    rota: '/corretor/cadastrar',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: LogOut,
    titulo: 'Sair',
    descricao: 'Encerrar sessão do painel.',
    rota: null,
    cor: 'text-red-400',
    bg: 'bg-red-50',
  },
]

export default function CorretorDashboard() {
  const navigate = useNavigate()
  const sessao = getSessao()
  const nome = sessao?.usuario?.nome || 'Corretor'

  function handleCard(rota, titulo) {
    if (titulo === 'Sair') {
      encerrarSessao()
      navigate('/login')
      return
    }
    if (rota) navigate(rota)
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Painel do Corretor
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-4">
            Olá, {nome.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 text-lg">
            Gerencie seus imóveis cadastrados no sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {cards.map(({ icon: Icon, titulo, descricao, rota, cor, bg }) => (
            <button
              key={titulo}
              onClick={() => handleCard(rota, titulo)}
              className="group text-left bg-light hover:bg-primary rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary transition-all duration-300"
            >
              <div className={`w-14 h-14 ${bg} group-hover:bg-white/10 rounded-2xl flex items-center justify-center mb-6 transition-all`}>
                <Icon size={26} className={`${cor} group-hover:text-white transition-colors`} />
              </div>
              <h3 className="text-lg font-serif font-bold text-primary group-hover:text-white transition-colors mb-2">
                {titulo}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-white/70 transition-colors leading-relaxed">
                {descricao}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
