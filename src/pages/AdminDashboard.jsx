import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, List, Settings, LogOut, UserPlus, Users } from 'lucide-react'
import { encerrarSessao } from '../services/authService'

const cards = [
  {
    icon: List,
    titulo: 'Listar Imóveis',
    descricao: 'Visualize, edite ou remova imóveis cadastrados.',
    rota: '/admin/imoveis',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: Home,
    titulo: 'Cadastrar Imóvel',
    descricao: 'Adicione um novo imóvel ao sistema.',
    rota: '/admin/cadastrar',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: UserPlus,
    titulo: 'Cadastrar Corretor',
    descricao: 'Adicione um novo corretor ao painel.',
    rota: '/cadastro-corretor',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: Users,
    titulo: 'Ver Corretores',
    descricao: 'Edite dados e gerencie senhas dos corretores.',
    rota: '/admin/corretores',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: Settings,
    titulo: 'Configurações do Site',
    descricao: 'Edite telefone, e-mail, endereço e redes sociais.',
    rota: '/admin/configuracoes',
    cor: 'text-secondary',
    bg: 'bg-light',
  },
  {
    icon: LogOut,
    titulo: 'Sair',
    descricao: 'Encerrar sessão do painel administrativo.',
    rota: null,
    cor: 'text-red-400',
    bg: 'bg-red-50',
  },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  function handleCard(rota, titulo) {
    if (titulo === 'Sair') {
      encerrarSessao()       
      navigate('/login')     
      return
    }
    if (rota) {
      navigate(rota)
    }
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-4">
            O que deseja fazer hoje?
          </h1>
          <p className="text-gray-500 text-lg">
            Gerencie imóveis, corretores e as configurações do site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
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
