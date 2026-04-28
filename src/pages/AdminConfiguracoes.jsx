// src/pages/AdminConfiguracoes.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { getSessao, getToken } from '../services/authService'

// valores iniciais locais (fallback)
const inicial = {
  telefone1: '(27) 3333-3333',
  telefone2: '(27) 99999-9999',
  email1: 'contato@ernanyvitorino.com.br',
  email2: 'vendas@ernanyvitorino.com.br',
  endereco: 'Rua Joaquim da Silva Lima, 595',
  cidade: 'Centro - Guarapari/ES',
  cep: 'CEP: 29200-260',
  instagram: '',
  facebook: '',
}

export default function AdminConfiguracoes() {
  const navigate = useNavigate()
  const [form, setForm] = useState(inicial)
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  // usa sessão centralizada
  const sessao = getSessao()

  useEffect(() => {
    // se não tem sessão, manda pro login
    if (!sessao) {
      navigate('/login')
      return
    }

    // se usuário não for admin, bloqueia (corretores não devem acessar)
    const papel = String(sessao.usuario?.papel || '').toLowerCase()
    if (papel !== 'admin') {
      // redireciona corretor para painel de imóveis
      navigate('/admin/imoveis')
      return
    }

    // opcional: carregar configurações do backend aqui
    // fetchConfig()
  }, [navigate, sessao])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      // exemplo local
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar configurações:', err)
      setErro(err.message || 'Erro ao salvar configurações.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        <button onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-primary font-medium mb-6 hover:opacity-70 transition-opacity">
          <ArrowLeft size={18} /> Voltar ao Dashboard
        </button>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Painel Admin</span>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Configurações do Site</h1>
          <p className="text-gray-500">Edite as informações de contato exibidas no site.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">

            {sucesso && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 text-sm font-medium">
                Configurações salvas com sucesso!
              </div>
            )}

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Phone size={18} className="text-secondary" />
                  <h3 className="text-lg font-serif font-bold text-primary">Telefone</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['telefone1', 'telefone2'].map((name, i) => (
                    <div key={name} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Telefone {i + 1}</label>
                      <input type="tel" name={name} value={form[name]} onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Mail size={18} className="text-secondary" />
                  <h3 className="text-lg font-serif font-bold text-primary">E-mail</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'email1', label: 'E-mail Principal' },
                    { name: 'email2', label: 'E-mail de Vendas' },
                  ].map(({ name, label }) => (
                    <div key={name} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
                      <input type="email" name={name} value={form[name]} onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <MapPin size={18} className="text-secondary" />
                  <h3 className="text-lg font-serif font-bold text-primary">Endereço</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'endereco', label: 'Rua / Número', placeholder: 'Rua Exemplo, 123' },
                    { name: 'cidade', label: 'Bairro / Cidade / Estado', placeholder: 'Centro - Guarapari/ES' },
                    { name: 'cep', label: 'CEP', placeholder: 'CEP: 00000-000' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
                      <input type="text" name={name} value={form[name]} onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Instagram size={18} className="text-secondary" />
                  <h3 className="text-lg font-serif font-bold text-primary">Redes Sociais</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/...' },
                    { name: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/...' },
                  ].map(({ name, label, icon: Icon, placeholder }) => (
                    <div key={name} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Icon size={14} /> {label}
                      </label>
                      <input type="url" name={name} value={form[name]} onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60">
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
