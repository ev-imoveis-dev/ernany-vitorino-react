// src/pages/TrocarSenha.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { trocarSenha, encerrarSessao, getSessao } from '../services/authService'

export default function TrocarSenha() {
  const navigate = useNavigate()
  const sessao = getSessao()

  const [form, setForm] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: '',
  })
  const [mostrar, setMostrar] = useState({
    senha_atual: false,
    nova_senha: false,
    confirmar_senha: false,
  })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    // se não houver sessão, redireciona para login
    if (!sessao) {
      navigate('/login')
    }
  }, [navigate, sessao])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleMostrar(campo) {
    setMostrar(prev => ({ ...prev, [campo]: !prev[campo] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (form.nova_senha !== form.confirmar_senha) {
      setErro('A nova senha e a confirmação não coincidem.')
      return
    }

    if (form.nova_senha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (form.nova_senha === form.senha_atual) {
      setErro('A nova senha não pode ser igual à senha atual.')
      return
    }

    setCarregando(true)

    try {
      // envia para o backend; se backend não exigir senha_atual, passe undefined
      const senha_atual = form.senha_atual || undefined
      await trocarSenha(senha_atual, form.nova_senha)

      // sucesso: encerra sessão e mostra mensagem antes de redirecionar
      encerrarSessao()
      setSucesso(true)

      // aguarda um instante para o usuário ver a mensagem, depois vai para login
      setTimeout(() => {
        navigate('/login')
      }, 900)
    } catch (err) {
      // mostra mensagem do backend quando disponível
      setErro(err?.message || 'Erro ao trocar senha. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  // botão "Ir para o login" — type button evita submit acidental
  function handleIrParaLogin() {
    encerrarSessao()
    navigate('/login')
  }

  const campos = [
    { name: 'senha_atual',      label: 'Senha atual',           placeholder: 'Digite sua senha atual' },
    { name: 'nova_senha',       label: 'Nova senha',            placeholder: 'Mínimo 6 caracteres' },
    { name: 'confirmar_senha',  label: 'Confirmar nova senha',  placeholder: 'Repita a nova senha' },
  ]

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Área Restrita
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            Trocar <br /> Senha
          </h1>
          <p className="text-gray-500 text-lg">
            Defina uma nova senha para sua conta.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">
            {sucesso ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-serif text-primary mb-3">
                  Senha alterada!
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                  Sua senha foi atualizada com sucesso. Faça login novamente com a nova senha.
                </p>
                <button
                  type="button"
                  onClick={handleIrParaLogin}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary hover:text-primary transition-all uppercase tracking-widest text-sm"
                >
                  Ir para o login
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-serif text-primary mb-2">
                  Nova senha
                </h3>
                <p className="text-gray-400 text-sm mb-8">
                  Olá, <strong>{sessao?.usuario?.nome}</strong>. Defina sua nova senha abaixo.
                </p>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
                    {erro}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {campos.map(({ name, label, placeholder }) => (
                    <div key={name} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {label}
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type={mostrar[name] ? 'text' : 'password'}
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          required={name !== 'senha_atual' ? true : false}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-4 focus:outline-none focus:border-secondary transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => toggleMostrar(name)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                          {mostrar[name] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {form.nova_senha && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(nivel => (
                          <div
                            key={nivel}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              form.nova_senha.length >= nivel * 4
                                ? nivel === 1 ? 'bg-red-400'
                                : nivel === 2 ? 'bg-yellow-400'
                                : 'bg-green-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        {form.nova_senha.length < 4 && 'Senha fraca'}
                        {form.nova_senha.length >= 4 && form.nova_senha.length < 8 && 'Senha razoável'}
                        {form.nova_senha.length >= 8 && 'Senha forte'}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60"
                  >
                    {carregando ? 'Salvando...' : 'Salvar nova senha'}
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
