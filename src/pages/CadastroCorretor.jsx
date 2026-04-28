import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, User, Phone, Copy, CheckCircle2, X } from 'lucide-react'
import { cadastrarCorretor } from '../services/corretorService'

const CadastroCorretor = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: ''
  })

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [senhaGerada, setSenhaGerada] = useState(null)
  const [copiado, setCopiado] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const data = await cadastrarCorretor(formData)
      setSenhaGerada(data)
      setFormData({ nome: '', email: '', celular: '' })
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar corretor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function copiarSenha() {
    navigator.clipboard.writeText(senhaGerada.senha_temporaria)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Painel Admin
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            Cadastrar <br /> Corretor
          </h1>
          <p className="text-gray-500 text-lg">
            Adicione um novo corretor. Uma senha temporária será gerada automaticamente.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">

            {/* Estado: sucesso */}
            {senhaGerada ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle2 size={64} className="text-green-500" />
                </div>

                <div>
                  <h3 className="text-2xl font-serif text-primary mb-2">
                    Corretor cadastrado!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Compartilhe as credenciais abaixo com {senhaGerada.nome}
                  </p>
                </div>

                {/* Credenciais */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 text-left">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      E-mail
                    </p>
                    <p className="text-sm font-mono text-primary">{senhaGerada.email}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Senha Temporária
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-primary font-bold tracking-widest">
                        {senhaGerada.senha_temporaria}
                      </p>
                      <button
                        onClick={copiarSenha}
                        className="p-2 hover:bg-light rounded transition-colors"
                        title="Copiar"
                      >
                        <Copy size={16} className={copiado ? 'text-green-500' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 text-xs text-yellow-700">
                    ⚠️ O corretor deve alterar a senha no primeiro login
                  </div>
                </div>

                {/* <button
                  onClick={() => {
                    setSenhaGerada(null)
                    setFormData({ nome: '', email: '', celular: '' })
                  }}
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary hover:text-primary transition-all"
                >
                  CADASTRAR OUTRO CORRETOR
                </button> */}

                <button
                  onClick={() => navigate('/admin')}
                  // className="w-full border border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-light transition-colors"
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary hover:text-primary transition-all"
                >
                  Voltar ao Dashboard
                </button>
              </div>
            ) : (
              <>
                {/* Formulário */}
                <h3 className="text-3xl font-serif text-primary mb-8">Novo Corretor</h3>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm flex items-start justify-between">
                    <span>{erro}</span>
                    <button onClick={() => setErro('')} className="shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Nome completo"
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="corretor@email.com"
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Celular
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="tel"
                        name="celular"
                        required
                        value={formData.celular}
                        onChange={handleChange}
                        placeholder="(27) 99999-9999"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                    <p className="font-medium mb-1">Como funciona:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Uma senha temporária será gerada</li>
                      <li>Compartilhe com o corretor</li>
                      <li>Ele altera no primeiro login</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60"
                  >
                    {carregando ? 'Cadastrando...' : 'Cadastrar Corretor'}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="w-full border border-gray-200 text-gray-500 font-bold py-4 rounded-xl hover:bg-light transition-colors uppercase tracking-widest text-sm"
                  >
                    Voltar ao Dashboard
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroCorretor