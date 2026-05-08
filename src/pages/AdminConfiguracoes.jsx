import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { getSessao } from '../services/authService'
import api from '../services/api'

const inicial = {
  telefone1: '',
  telefone2: '',
  email1: '',
  email2: '',
  endereco: '',
  cidade: '',
  cep: '',
  instagram: '',
  facebook: '',
}

export default function AdminConfiguracoes() {
  const navigate = useNavigate()
  const [form, setForm] = useState(inicial)
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const sessao = getSessao()

  useEffect(() => {
    if (!sessao) {
      navigate('/login')
      return
    }

    const papel = String(sessao.usuario?.papel || '').toLowerCase()
    if (papel !== 'admin') {
      navigate('/admin/imoveis')
      return
    }

    fetchConfiguracoes()
  }, [navigate, sessao])

  async function fetchConfiguracoes() {
    try {
      setCarregando(true)
      const { data } = await api.get('/configuracoes')
      if (!data.sucesso) throw new Error(data.erro || 'Erro ao carregar configurações.')
      setForm(data.data)
    } catch (err) {
      setErro(err.message || 'Erro ao carregar configurações.')
    } finally {
      setCarregando(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      const { data } = await api.put('/configuracoes', form)
      if (!data.sucesso) throw new Error(data.erro || 'Erro ao salvar configurações.')
      setForm(data.data)
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (err) {
      setErro(err.message || 'Erro ao salvar configurações.')
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Carregando configurações...</p>
      </div>
    )
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