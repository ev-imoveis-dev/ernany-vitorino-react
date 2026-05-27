import React, { useState } from 'react'
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { useConfig } from '../context/ConfigContext'

function validarFormularioContato(formData) {
  const errors = {}
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.nome.trim()) errors.nome = 'Este campo é obrigatório'

  if (!formData.email.trim()) {
    errors.email = 'Este campo é obrigatório'
  } else if (!emailValido.test(formData.email.trim())) {
    errors.email = 'E-mail inválido'
  }

  if (!formData.assunto.trim()) errors.assunto = 'Este campo é obrigatório'
  if (!formData.mensagem.trim()) errors.mensagem = 'Este campo é obrigatório'

  return errors
}

const camposIniciais = {
  nome: '',
  email: '',
  assunto: 'Comprar Imóvel',
  mensagem: '',
}

const inputBaseClass = 'w-full bg-white border rounded-xl px-4 py-4 focus:outline-none focus:border-secondary transition-colors'

const Contact = () => {
  const config = useConfig()
  const [formData, setFormData] = useState(camposIniciais)
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    const errors = validarFormularioContato(formData)
    setFormErrors(prev => ({ ...prev, [name]: errors[name] || '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validarFormularioContato(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const raw = config?.telefone1?.replace(/\D/g, '')
    const numero = raw ? (raw.startsWith('55') ? raw : `55${raw}`) : null
    if (!numero) return

    const texto = encodeURIComponent(
      `Olá! Me chamo ${formData.nome.trim()}.\n` +
      `E-mail: ${formData.email.trim()}\n` +
      `Assunto: ${formData.assunto}\n\n` +
      formData.mensagem.trim()
    )

    window.open(`https://wa.me/${numero}?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  const fieldClass = (name) => `${inputBaseClass} ${formErrors[name] ? 'border-red-400' : 'border-gray-200'}`

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
                {/* {config?.email2 || ''} */}
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

          <div className="bg-light p-8 md:p-12 rounded-3xl">
            <h3 className="text-3xl font-serif text-primary mb-8">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldClass('nome')}
                  placeholder="Seu nome"
                />
                {formErrors.nome && (
                  <p className="text-sm text-red-500">{formErrors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldClass('email')}
                  placeholder="seu@email.com"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Telefone removido: o usuário já vai enviar via WhatsApp, não precisa digitar o número */}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Assunto</label>
                <select
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${fieldClass('assunto')} appearance-none`}
                >
                  <option>Comprar Imóvel</option>
                  <option>Alugar Imóvel</option>
                  <option>Anunciar Imóvel</option>
                  <option>Outros Assuntos</option>
                </select>
                {formErrors.assunto && (
                  <p className="text-sm text-red-500">{formErrors.assunto}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Mensagem</label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="6"
                  className={fieldClass('mensagem')}
                  placeholder="Como podemos ajudar?"
                />
                {formErrors.mensagem && (
                  <p className="text-sm text-red-500">{formErrors.mensagem}</p>
                )}
              </div>

              <button type="submit"
                className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm">
                Enviar pelo WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
