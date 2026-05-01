import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getImovelById, updateImovel } from '../services/imovelService'
import { getSessao } from '../services/authService'
import { getCorretores } from "../services/usuarioService"

import {
  BedDouble, Bath, Square, Car, User, MapPin,
  Home, ArrowLeft, X, Image
} from 'lucide-react'

export default function AdminEditarImovel() {
  const navigate = useNavigate()
  const { id } = useParams()

  const sessao = useMemo(() => getSessao(), [])
  const papel = String(sessao?.usuario?.papel || '').toLowerCase()
  const usuarioId = String(sessao?.usuario?.id || '')
  const prefixo = papel === 'admin' ? '/admin' : '/corretor'

  const [form, setForm] = useState(null)
  const [previewFoto, setPreviewFoto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(true)
  const nomeUsuario = sessao?.usuario?.nome;
  const [corretores, setCorretores] = useState([])
  const [corretorSelecionado, setCorretorSelecionado] = useState(usuarioId)

  useEffect(() => {
    getImovelById(id)
      .then(data => {
        setForm({
          nome: data.nome ?? '',
          referencia: data.referencia ?? '',
          tipo_imovel: data.tipo_imovel ?? '',
          tipo: data.tipo ?? 'venda',
          valor: data.valor ?? '',
          quartos: data.quartos ?? '',
          banheiros: data.banheiros ?? '',
          tamanho: data.tamanho ?? '',
          vagas: data.vagas ?? '',
          descricao: data.descricao ?? '',
          caracteristicas: data.caracteristicas ?? '',
          corretor: data.corretor ?? '',
          localizacao: data.localizacao ?? '',
          imagem: data.imagem ?? '',
        })

        setCorretorSelecionado(String(data.corretor || ''))
        setPreviewFoto(data.imagem ?? '')
      })
      .catch(() => setErro('Não foi possível carregar os dados do imóvel.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    //   if (papel === 'admin') {
    //     getCorretores().then(lista => {
    //       const dados = Array.isArray(lista) ? lista : (lista?.dados ?? [])
    //       setCorretores(dados)
    //     })
    //   } else {
    //     setCorretorSelecionado(usuarioId)
    //     setForm(prev => prev ? { ...prev, corretor: usuarioId } : prev)
    //   }
    // }, [papel, usuarioId])

    if (papel === "admin") {
      getCorretores()
        .then((lista) => {
          const dados = Array.isArray(lista)
            ? lista
            : (lista?.dados ?? lista ?? []);
          const apenasCorretores = dados.filter(
            (u) => String(u.papel || "").toLowerCase() === "corretor",
          );
          setCorretores(apenasCorretores);
        })
        .catch((err) => {
          console.error("Erro ao carregar usuários:", err);
        });
    } else {
      // se não for admin, garante que o corretor selecionado seja o próprio usuário
      setCorretorSelecionado(usuarioId);
      setForm((prev) => ({ ...prev, corretor: usuarioId }));
    }
  }, [papel, usuarioId]);

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'imagem') setPreviewFoto(value)
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

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    setSucesso(false)

    try {
      const payload = {
        ...form,
        valor: parseFloat(form.valor),
        quartos: form.quartos ? parseInt(form.quartos) : undefined,
        banheiros: form.banheiros ? parseInt(form.banheiros) : undefined,
        tamanho: form.tamanho ? parseFloat(form.tamanho) : undefined,
        vagas: form.vagas ? parseInt(form.vagas) : undefined,
        corretor:
          papel === 'corretor'
            ? usuarioId
            : (corretorSelecionado === '' ? undefined : corretorSelecionado),
      }

      await updateImovel(id, payload)

      setSucesso(true)
      window.scrollTo(0, 0)

    } catch (err) {
      setErro(err.message || 'Erro ao atualizar imóvel. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return (
    <div className="pt-32 pb-24 bg-light min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Carregando dados do imóvel...</p>
    </div>
  )

  if (erro && !form) return (
    <div className="pt-32 pb-24 bg-light min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-lg">{erro}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-light pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(`${prefixo}/imoveis`)}
            className="flex items-center gap-2 text-primary font-medium hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={18} /> Voltar à listagem
          </button>
        </div>

        <div className="mb-8">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">Painel Admin</span>
          <h1 className="text-4xl font-serif font-bold text-primary">Editar Imóvel - {form.referencia}</h1>
          <p className="text-gray-400 mt-1">Atualize os dados do imóvel abaixo.</p>
        </div>

        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">Imóvel atualizado com sucesso!</span>
            <button onClick={() => setSucesso(false)}><X size={18} /></button>
          </div>
        )}

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
                type="text" name="nome" value={form.nome} onChange={handleChange}
                placeholder="Ex.: Apartamento no Centro" required
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* {form.referencia && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Código de Referência</label>
                <div 
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <input type="text" value={form.referencia} disabled className="bg-transparent flex-1" />
                </div>
              </div>
            )} */}

            {/* Imagem */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Imagem do imóvel</label>
              <input
                type="url" name="imagem" value={form.imagem} onChange={handleChange}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary mb-3"
              />

              {previewFoto && (
                <div className="relative">
                  <img src={previewFoto} alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                    onError={() => setPreviewFoto('')} />
                  <button type="button"
                    onClick={() => { setPreviewFoto(''); setForm(prev => ({ ...prev, imagem: '' })) }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Tipo, Finalidade e Valor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo do imóvel *</label>
                <select name="tipo_imovel" value={form.tipo_imovel} onChange={handleChange} required
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option value="">Selecione</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Finalidade *</label>
                <select name="tipo" value={form.tipo} onChange={handleChange} required
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Valor (R$) *</label>
                <div className="relative">
                  <input type="number" name="valor" value={form.valor} onChange={handleChange}
                    placeholder="Ex.: 350000" required min="0"
                    className="w-full bg-light p-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">R$</span>
                </div>
              </div>
            </div>

            {/* Quartos etc */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Quartos', name: 'quartos', icon: BedDouble },
                { label: 'Banheiros', name: 'banheiros', icon: Bath },
                { label: 'Tamanho (m²)', name: 'tamanho', icon: Square },
                { label: 'Vagas', name: 'vagas', icon: Car },
              ].map(({ label, name, icon: Icon }) => (
                <div key={name}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="number" name={name} value={form[name]} onChange={handleChange}
                      className="w-full bg-light p-3 pl-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Descrição */}
            <textarea name="descricao" value={form.descricao} onChange={handleChange}
              className="w-full bg-light p-3 rounded-xl" />

            {/* Características */}
            <input type="text" name="caracteristicas" value={form.caracteristicas} onChange={handleChange}
              className="w-full bg-light p-3 rounded-xl" />

            {/* 🔥 REGRA AQUI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {papel === 'admin' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Corretor responsável
                  </label>
                  <select
                    value={corretorSelecionado}
                    onChange={e => {
                      setCorretorSelecionado(e.target.value)
                      setForm(prev => ({ ...prev, corretor: e.target.value }))
                    }}
                    className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">{nomeUsuario}</option>
                    {corretores.map(c => (
                      <option key={c.id} value={String(c.id)}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Localização</label>
                <input type="text" name="localizacao" value={form.localizacao} onChange={handleChange}
                  className="w-full bg-light p-3 rounded-xl"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => navigate(`${prefixo}/imoveis`)}
                className="px-6 py-3 rounded-xl border">
                Cancelar
              </button>

              <button type="submit" disabled={enviando}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl">
                <Home size={16} />
                {enviando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}