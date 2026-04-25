import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, List, Settings, LogOut } from 'lucide-react'

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
  const corretor = JSON.parse(localStorage.getItem('corretor_logado') || 'null')

//   useEffect(() => {
//     if (!corretor) navigate('/login')
//   }, [])

//   if (!corretor) return null

  function handleCard(rota) {
    if (!rota) {
      localStorage.removeItem('corretor_logado')
    //   navigate('/login')
      return
    }
    navigate(rota)
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Painel Administrativo
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-4">
            {/* Olá, {corretor.nome.split(' ')[0]} */}
          </h1>
          <p className="text-gray-500 text-lg">O que deseja fazer hoje?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {cards.map(({ icon: Icon, titulo, descricao, rota, cor, bg }) => (
            <button
              key={titulo}
              onClick={() => handleCard(rota)}
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