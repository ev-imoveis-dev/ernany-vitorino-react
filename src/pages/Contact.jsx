import React, { useState } from 'react'
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useConfig } from '../context/ConfigContext'
import { enviarContato } from '../services/contatoService'

const Contact = () => {
  const config = useConfig()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: 'Comprar Imóvel',
    mensagem: ''
  })
  const [carregando, setCarregando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    try {
      await enviarContato(formData)
      toast.success('Mensagem enviada! Em breve entraremos em contato.')
      setFormData({ nome: '', email: '', telefone: '', assunto: 'Comprar Imóvel', mensagem: '' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Fale Conosco</span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Estamos aqui para <br /> realizar seu sonho</h1>
          <p className="text-gray-500 text-lg">
            Entre em contato para agendar uma visita ou tirar suas dúvidas sobre os imóveis de Guarapari.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-light rounded-xl flex items-center justify-center text-secondary">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">Endereço</h3>
              <p className="text-gray-500">
                {config?.endereco || '—'}<br />
                {config?.cidade || ''}<br />
                {config?.cep || ''}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-light rounded-xl flex items-center justify-center text-secondary">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">Telefone</h3>
              <p className="text-gray-500">
                {config?.telefone1 || '—'}<br />
                {config?.telefone2 || ''}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-light rounded-xl flex items-center justify-center text-secondary">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">E-mail</h3>
              <p className="text-gray-500">
                {config?.email1 || '—'}<br />
                {config?.email2 || ''}
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-light rounded-xl flex items-center justify-center text-secondary">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">Social</h3>
              <div className="flex gap-4">
                {config?.instagram && (
                  <a href={config.instagram} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-secondary transition-colors">
                    <Instagram size={20} />
                  </a>
                )}
                {config?.facebook && (
                  <a href={config.facebook} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-secondary transition-colors">
                    <Facebook size={20} />
                  </a>
                )}
                {!config?.instagram && !config?.facebook && (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-light p-8 md:p-12 rounded-3xl">
            <h3 className="text-3xl font-serif text-primary mb-8">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome Completo</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">E-mail</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="seu@email.com" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Telefone</label>
                  <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="(00) 00000-0000" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Assunto</label>
                  <select name="assunto" value={formData.assunto} onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors appearance-none">
                    <option>Comprar Imóvel</option>
                    <option>Alugar Imóvel</option>
                    <option>Anunciar Imóvel</option>
                    <option>Outros Assuntos</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Mensagem</label>
                <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} rows="6"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="Como podemos ajudar?" required />
              </div>
              <button type="submit" disabled={carregando}
                className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60">
                {carregando ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact