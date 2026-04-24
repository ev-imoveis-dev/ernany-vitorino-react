import React, { useState, useEffect } from 'react' // Adicionado useEffect
import { useNavigate } from 'react-router-dom'
import { createImovel } from '../services/imovelService'
import {
  BedDouble, Bath, Square, Car, User, MapPin,
  Home, ArrowLeft, X, Plus, Image, Link, LogOut
} from 'lucide-react'

const camposIniciais = {
  nome: '',
  tipo_imovel: '',
  tipo: 'venda',
  valor: '',
  quartos: '',
  banheiros: '',
  tamanho: '',
  vagas: '',
  descricao: '',
  caracteristicas: '',
  corretor: 'Ernany Vitorino',
  localizacao: '',
  imagem: '',
}

export default function Admin() {
  const navigate = useNavigate()
  
  // --- PROTEÇÃO DA ROTA ---
  const adminLogado = JSON.parse(localStorage.getItem('corretor_logado') || 'null');

  useEffect(() => {
    if (!adminLogado) {
      navigate('/login');
    }
  }, [adminLogado, navigate]);

  // Se não estiver logado, não renderiza nada enquanto o useEffect redireciona
  if (!adminLogado) return null;
  // -----------------------

  const [form, setForm] = useState(camposIniciais)
  const [modoFoto, setModoFoto] = useState('url')
  const [previewFoto, setPreviewFoto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'imagem' && modoFoto === 'url') {
      setPreviewFoto(value)
    }
  }

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreviewFoto(ev.target.result)
      setForm(prev => ({ ...prev, imagem: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function handleLimpar() {
    setForm(camposIniciais)
    setPreviewFoto('')
    setSucesso(false)
    setErro('')
  }

  function handleLogout() {
    localStorage.removeItem('corretor_logado');
    navigate('/login');
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    setSucesso(false)

    try {
      await createImovel({
        ...form,
        valor: parseFloat(form.valor),
        quartos: parseInt(form.quartos),
        banheiros: parseInt(form.banheiros),
        tamanho: parseFloat(form.tamanho),
        vagas: parseInt(form.vagas),
      })
      setSucesso(true)
      setForm(camposIniciais)
      setPreviewFoto('')
    } catch {
      setErro('Erro ao cadastrar imóvel. Verifique os dados e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-light pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header com Voltar e Logout */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/imoveis')}
            className="flex items-center gap-2 text-primary font-medium hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={18} />
            Voltar para o site
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-medium hover:opacity-70 transition-opacity"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        {/* Header Título */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">Cadastrar Imóvel</h1>
          <p className="text-gray-400 mt-1">Bem-vindo, {adminLogado.nome}.</p>
        </div>

        {/* Sucesso */}
        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">Imóvel cadastrado com sucesso!</span>
            <button onClick={() => setSucesso(false)}><X size={18} /></button>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span>{erro}</span>
            <button onClick={() => setErro('')}><X size={18} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

            {/* Nome */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nome do imóvel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: Apartamento no Centro"
                required
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary border border-transparent focus:border-secondary"
              />
            </div>

            {/* Foto */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Imagem do imóvel</label>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setModoFoto('url')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${modoFoto === 'url' ? 'bg-primary text-white' : 'bg-light text-gray-500'}`}
                >
                  <Link size={14} /> Colar URL
                </button>
                <button
                  type="button"
                  onClick={() => setModoFoto('upload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${modoFoto === 'upload' ? 'bg-primary text-white' : 'bg-light text-gray-500'}`}
                >
                  <Image size={14} /> Upload
                </button>
              </div>

              {modoFoto === 'url' ? (
                <input
                  type="url"
                  name="imagem"
                  value={form.imagem}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              ) : (
                <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-secondary transition-colors">
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <Image size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Clique para selecionar uma imagem</p>
                  <p className="text-xs text-gray-300 mt-1">ou arraste e solte aqui</p>
                </label>
              )}

              {previewFoto && (
                <div className="mt-3 relative">
                  <img
                    src={previewFoto}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                    onError={() => setPreviewFoto('')}
                  />
                  <button
                    type="button"
                    onClick={() => { setPreviewFoto(''); setForm(prev => ({ ...prev, imagem: '' })) }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Tipo, Finalidade e Valor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo do imóvel *</label>
                <select
                  name="tipo_imovel"
                  value={form.tipo_imovel}
                  onChange={handleChange}
                  required
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Finalidade *</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Valor (R$) *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="valor"
                    value={form.valor}
                    onChange={handleChange}
                    placeholder="Ex.: 350000"
                    required
                    min="0"
                    className="w-full bg-light p-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">R$</span>
                </div>
              </div>
            </div>

            {/* Detalhes Técnicos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Quartos', name: 'quartos', icon: BedDouble, placeholder: 'Ex.: 3' },
                { label: 'Banheiros', name: 'banheiros', icon: Bath, placeholder: 'Ex.: 2' },
                { label: 'Tamanho (m²)', name: 'tamanho', icon: Square, placeholder: 'Ex.: 120' },
                { label: 'Vagas de garagem', name: 'vagas', icon: Car, placeholder: 'Ex.: 1' },
              ].map(({ label, name, icon: Icon, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="number"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      min="0"
                      className="w-full bg-light p-3 pl-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva o imóvel..."
                rows={4}
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            {/* Características */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Características</label>
              <input
                type="text"
                name="caracteristicas"
                value={form.caracteristicas}
                onChange={handleChange}
                placeholder="Ex.: Varanda, Churrasqueira, Piscina..."
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* Corretor e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Corretor responsável</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    name="corretor"
                    value={form.corretor}
                    onChange={handleChange}
                    className="w-full bg-light p-3 pl-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Localização</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    name="localizacao"
                    value={form.localizacao}
                    onChange={handleChange}
                    placeholder="Ex.: Praia do Morro, Guarapari - ES"
                    className="w-full bg-light p-3 pl-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleLimpar}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-light transition-colors"
              >
                Limpar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <Home size={16} />
                {enviando ? 'Cadastrando...' : 'Cadastrar Imóvel'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}