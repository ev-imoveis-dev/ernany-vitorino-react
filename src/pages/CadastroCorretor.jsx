import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const CadastroCorretor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Verifica se há admin logado
  const adminLogado = JSON.parse(localStorage.getItem('corretor_logado') || 'null');
  if (!adminLogado) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      // Integração futura com API de autenticação
      // await cadastrarCorretor(formData)

      setSucesso(true);
      setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
    } catch {
      setErro('Erro ao cadastrar corretor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Painel Admin</span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Cadastrar <br /> Corretor</h1>
          <p className="text-gray-500 text-lg">
            Adicione um novo corretor para acessar o painel de cadastro de imóveis.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-light p-8 md:p-12 rounded-3xl">
            <h3 className="text-3xl font-serif text-primary mb-8">Novo Corretor</h3>

            {sucesso && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm font-medium">
                Corretor cadastrado com sucesso!
              </div>
            )}

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome Completo</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="Nome completo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">E-mail</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="corretor@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="Mínimo 6 caracteres"
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

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirmar Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type={mostrarConfirmar ? 'text' : 'password'}
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-4 focus:outline-none focus:border-secondary transition-colors"
                    placeholder="Repita a senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                Voltar ao Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroCorretor;