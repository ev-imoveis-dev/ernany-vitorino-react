import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { esqueceuSenha } from '../services/authService'

export default function EsqueceuSenha() {
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await esqueceuSenha(email)
      setEnviado(true)
    } catch (err) {
      setErro(err.message || 'Erro ao solicitar recuperacao. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
            Area Restrita
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">
            Recuperar <br /> Senha
          </h1>
          <p className="text-gray-500 text-lg">
            Informe seu e-mail e enviaremos um link unico para redefinir sua senha.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium mb-8"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>

            {enviado ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-serif text-primary mb-3">
                  E-mail enviado!
                </h3>
                <p className="text-gray-500 text-sm mb-8">
                  Se este e-mail estiver cadastrado, voce recebera um link de recuperacao em instantes. Verifique tambem a caixa de spam.
                </p>
                <Link
                  to="/login"
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary hover:text-primary transition-all uppercase tracking-widest text-sm flex items-center justify-center"
                >
                  Ir para o login
                </Link>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-serif text-primary mb-8">
                  Esqueceu a senha?
                </h3>

                {erro && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
                    {erro}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      E-mail cadastrado
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-primary text-white font-bold py-5 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm disabled:opacity-60"
                  >
                    {carregando ? 'Enviando link...' : 'Enviar link de recuperacao'}
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
