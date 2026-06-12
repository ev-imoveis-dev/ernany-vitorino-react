import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
import { trocarSenha, redefinirSenha, encerrarSessao, getSessao } from '../services/authService'

function validarNovaSenha(form, exigirSenhaAtual) {
  if (exigirSenhaAtual && !form.senha_atual) {
    return 'Informe sua senha atual.'
  }

  if (form.nova_senha !== form.confirmar_senha) {
    return 'A nova senha e a confirmacao nao coincidem.'
  }

  if (form.nova_senha.length < 8) {
    return 'A nova senha deve ter no minimo 8 caracteres.'
  }

  if (!/[A-Za-z]/.test(form.nova_senha)) {
    return 'A nova senha deve conter ao menos uma letra.'
  }

  if (!/\d/.test(form.nova_senha)) {
    return 'A nova senha deve conter ao menos um digito.'
  }

  if (exigirSenhaAtual && form.nova_senha === form.senha_atual) {
    return 'A nova senha nao pode ser igual a senha atual.'
  }

  return ''
}

export default function TrocarSenha() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const mode = searchParams.get('mode') || ''
  const modoRecuperacao = token.length > 0
  const modoCriacao = modoRecuperacao && mode === 'create'

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

  const sessao = getSessao()

  useEffect(() => {
    if (!modoRecuperacao && !getSessao()) {
      navigate('/login')
    }
  }, [modoRecuperacao, navigate])

  const titulo = modoCriacao
    ? 'Criar'
    : modoRecuperacao
      ? 'Redefinir'
      : 'Trocar'
  const subtitulo = modoCriacao
    ? 'Defina sua senha para concluir o primeiro acesso da conta.'
    : modoRecuperacao
      ? 'Defina sua nova senha para concluir a recuperacao da conta.'
    : 'Defina uma nova senha para sua conta.'
  const saudacao = useMemo(() => {
    if (modoCriacao) return 'Crie sua senha de acesso abaixo.'
    if (modoRecuperacao) return 'Digite sua nova senha abaixo.'
    return `Ola, ${sessao?.usuario?.nome || 'usuario'}. Defina sua nova senha abaixo.`
  }, [modoCriacao, modoRecuperacao, sessao])
  const tituloFormulario = modoCriacao ? 'Criar senha' : 'Nova senha'
  const tituloSucesso = modoCriacao ? 'Senha criada!' : 'Senha atualizada!'
  const textoSucesso = modoCriacao
    ? 'Sua senha foi criada com sucesso. Faca login para acessar o painel.'
    : 'Sua senha foi salva com sucesso. Faca login novamente para continuar.'
  const textoBotao = modoCriacao ? 'Criar senha' : 'Salvar nova senha'

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

    const erroValidacao = validarNovaSenha(form, !modoRecuperacao)
    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    setCarregando(true)

    try {
      if (modoRecuperacao) {
        await redefinirSenha(token, form.nova_senha)
      } else {
        await trocarSenha(form.senha_atual, form.nova_senha)
        encerrarSessao()
      }

      setSucesso(true)
      setTimeout(() => {
        navigate('/login')
      }, 900)
    } catch (err) {
      setErro(err?.response?.data?.erro || err?.message || 'Erro ao salvar a nova senha. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function handleIrParaLogin() {
    if (!modoRecuperacao) {
      encerrarSessao()
    }
    navigate('/login')
  }

  const campos = modoRecuperacao
    ? [
        { name: 'nova_senha', label: 'Nova senha', placeholder: 'Min. 8 chars, 1 letra + 1 digito' },
        { name: 'confirmar_senha', label: 'Confirmar nova senha', placeholder: 'Repita a nova senha' },
      ]
    : [
        { name: 'senha_atual', label: 'Senha atual', placeholder: 'Digite sua senha atual' },
        { name: 'nova_senha', label: 'Nova senha', placeholder: 'Min. 8 chars, 1 letra + 1 digito' },
        { name: 'confirmar_senha', label: 'Confirmar nova senha', placeholder: 'Repita a nova senha' },
      ]

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Area Restrita
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            {titulo} <br /> Senha
          </h1>
          <p className="text-gray-500 text-lg">
            {subtitulo}
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
                  {tituloSucesso}
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                  {textoSucesso}
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
                <div className="mb-8">
                  {modoRecuperacao ? (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium mb-6"
                    >
                      <ArrowLeft size={16} />
                      Voltar para o login
                    </Link>
                  ) : null}

                  <h3 className="text-3xl font-serif text-primary mb-2">
                    {tituloFormulario}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {saudacao}
                  </p>
                </div>

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
                          required
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
                        {form.nova_senha.length >= 4 && form.nova_senha.length < 8 && 'Senha razoavel'}
                        {form.nova_senha.length >= 8 && 'Senha forte'}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60"
                  >
                    {carregando ? 'Salvando...' : textoBotao}
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
