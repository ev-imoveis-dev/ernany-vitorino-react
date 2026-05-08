import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, User, Phone, CheckCircle2, X } from 'lucide-react'
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
  const [corretorCadastrado, setCorretorCadastrado] = useState(null)

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
      setCorretorCadastrado(data)
      setFormData({ nome: '', email: '', celular: '' })
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar corretor. Tente novamente.')
    } finally {
      setCarregando(false)
    }
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
            Adicione um novo corretor. As credenciais serão enviadas por e-mail automaticamente.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">

            {/* Estado: sucesso */}
            {corretorCadastrado ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle2 size={64} className="text-green-500" />
                </div>

                <div>
                  <h3 className="text-2xl font-serif text-primary mb-2">
                    Corretor cadastrado!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    As credenciais foram enviadas por e-mail para{' '}
                    <span className="font-medium text-primary">{corretorCadastrado.email}</span>.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/admin')}
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
                      <li>As credenciais são enviadas por e-mail ao corretor</li>
                      <li>Ele altera a senha no primeiro login</li>
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