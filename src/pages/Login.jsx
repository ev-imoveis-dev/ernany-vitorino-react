// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { loginUsuario, salvarSessao } from '../services/authService'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', senha: '' })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const data = await loginUsuario(formData)

      // Token agora vive em cookie HttpOnly setado pelo backend.
      // Frontend so persiste dados de UI (nome, papel) em localStorage.
      const usuario = data.usuario ?? data.user ?? data.data?.usuario
      const trocar_senha = data.trocar_senha ?? data.data?.trocar_senha ?? false

      if (!usuario) {
        throw new Error('Resposta do servidor inválida.')
      }

      if (usuario.papel) usuario.papel = String(usuario.papel).toLowerCase()

      salvarSessao(usuario, trocar_senha)

      if (trocar_senha) {
        navigate('/trocar-senha')
        return
      }

      if (usuario.papel === 'admin') {
        navigate('/admin')
      } else if (usuario.papel === 'corretor') {
        navigate('/corretor')
      } else {
        navigate('/') // fallback seguro
      }
    } catch (err) {
      setErro(err.response?.data?.erro || err.message || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Área Restrita
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            Acesso de <br /> Corretores
          </h1>
          <p className="text-gray-500 text-lg">
            Entre com suas credenciais para acessar o painel de cadastro de imóveis.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">
            <h3 className="text-3xl font-serif text-primary mb-8">Entrar</h3>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Senha
                  </label>
                  <Link
                    to="/esqueceu-senha"
                    className="text-xs text-gray-400 hover:text-secondary transition-colors font-medium"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="Sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
