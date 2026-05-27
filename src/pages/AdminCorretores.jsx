import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, User, Pencil, KeyRound, X, Check, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { atualizarCorretor, enviarNovaSenha } from '../services/corretorService'
import { formatPhoneBR } from '../utils/phone'
import { useCorretores } from '../hooks/useCorretores'
import { useForm } from '../hooks/useForm'

function validarCorretor(form) {
  const errors = {}
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const celularNumeros = form.celular.replace(/\D/g, '')

  if (!form.nome.trim()) errors.nome = 'Este campo é obrigatório'

  if (!form.email.trim()) {
    errors.email = 'Este campo é obrigatório'
  } else if (!emailValido.test(form.email.trim())) {
    errors.email = 'E-mail inválido'
  }

  if (!form.celular.trim()) {
    errors.celular = 'Este campo é obrigatório'
  } else if (celularNumeros.length < 10) {
    errors.celular = 'Celular inválido'
  }

  return errors
}

function ModalEditar({ corretor, onClose, onSalvo }) {
  const { form, errors: formErrors, handleChange, handleBlur, validate } = useForm(
    { nome: corretor.nome || '', email: corretor.email || '', celular: formatPhoneBR(corretor.celular || '') },
    validarCorretor,
    { celular: formatPhoneBR }
  )
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) return

    setSalvando(true)
    try {
      await atualizarCorretor(corretor.id, form)
      toast.success('Corretor atualizado com sucesso.')
      onSalvo({ ...corretor, ...form })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSalvando(false)
    }
  }

  const fieldClass = (name) => `w-full bg-light border rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-secondary transition-colors ${
    formErrors[name] ? 'border-red-400' : 'border-gray-200'
  }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-primary">Editar Corretor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome Completo</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nome completo"
                className={fieldClass('nome')}
              />
            </div>
            {formErrors.nome && (
              <p className="text-sm text-red-500">{formErrors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="corretor@email.com"
                className={fieldClass('email')}
              />
            </div>
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Celular</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="tel"
                name="celular"
                value={form.celular}
                onChange={handleChange}
                onBlur={handleBlur}
                inputMode="numeric"
                placeholder="(27) 99999-9999"
                className={fieldClass('celular')}
              />
            </div>
            {formErrors.celular && (
              <p className="text-sm text-red-500">{formErrors.celular}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-500 font-bold py-3.5 rounded-xl hover:bg-light transition-colors text-sm uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm uppercase tracking-widest disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCorretores() {
  const navigate = useNavigate()
  const { corretores, setCorretores, carregando } = useCorretores()
  const [editando, setEditando] = useState(null)
  const [enviandoSenha, setEnviandoSenha] = useState(null)

  async function handleNovaSenha(corretor) {
    setEnviandoSenha(corretor.id)
    try {
      await enviarNovaSenha(corretor.id)
      toast.success(`Nova senha enviada para ${corretor.email}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setEnviandoSenha(null)
    }
  }

  function handleSalvo(corretorAtualizado) {
    setCorretores(prev => prev.map(c => c.id === corretorAtualizado.id ? corretorAtualizado : c))
    setEditando(null)
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-primary font-medium mb-6 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={18} /> Voltar ao Dashboard
        </button>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Painel Admin
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            Corretores
          </h1>
          <p className="text-gray-500 text-lg">
            Gerencie os corretores cadastrados no sistema.
          </p>
          <button
            onClick={() => navigate('/cadastro-corretor')}
            className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm uppercase tracking-widest shadow-lg shadow-primary/10"
          >
            <UserPlus size={18} />
            Cadastrar Corretor
          </button>
        </div>

        {carregando ? (
          <div className="flex justify-center py-24">
            <p className="text-gray-400 text-sm uppercase tracking-widest">Carregando...</p>
          </div>
        ) : corretores.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-24">
            <p className="text-gray-400 text-sm">Nenhum corretor cadastrado ainda.</p>
            <button
              onClick={() => navigate('/cadastro-corretor')}
              className="mt-6 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-secondary hover:text-primary transition-all text-sm uppercase tracking-widest"
            >
              Cadastrar primeiro corretor
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {corretores.map(corretor => (
              <div
                key={corretor.id}
                className="bg-light rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Avatar inicial */}
                <div className="w-12 h-12 shrink-0 bg-primary rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">
                  {corretor.nome.charAt(0).toUpperCase()}
                </div>

                {/* Dados */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-primary text-lg leading-tight">
                      {corretor.nome}
                    </h3>
                    {corretor.trocar_senha === 1 && (
                      <span className="text-xs font-bold uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Troca de senha pendente
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Mail size={13} /> {corretor.email}
                    </span>
                    {corretor.celular && (
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Phone size={13} /> {corretor.celular}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditando(corretor)}
                    className="flex items-center gap-2 border border-gray-200 text-gray-500 hover:border-primary hover:text-primary font-bold px-4 py-2.5 rounded-xl transition-all text-sm"
                    title="Editar dados"
                  >
                    <Pencil size={15} />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => handleNovaSenha(corretor)}
                    disabled={enviandoSenha === corretor.id}
                    className="flex items-center gap-2 bg-primary text-white hover:bg-secondary hover:text-primary font-bold px-4 py-2.5 rounded-xl transition-all text-sm disabled:opacity-60"
                    title="Enviar nova senha por e-mail"
                  >
                    {enviandoSenha === corretor.id ? (
                      <span className="text-xs">Enviando...</span>
                    ) : (
                      <>
                        <KeyRound size={15} />
                        <span className="hidden sm:inline">Nova senha</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editando && (
        <ModalEditar
          corretor={editando}
          onClose={() => setEditando(null)}
          onSalvo={handleSalvo}
        />
      )}
    </div>
  )
}
