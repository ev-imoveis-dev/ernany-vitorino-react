import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GaleriaUpload from '../components/GaleriaUpload'
import { getImovelById, updateImovel } from '../services/imovelService'
import { getCorretores } from "../services/usuarioService"
import { formatCurrencyInputBRL, parseCurrencyInputBRL } from '../utils/currency'
import { criarItemImagemExistente, montarFormDataImovel } from '../utils/imovelFormData'
import { useSessionRole } from '../hooks/useSessionRole'
import { useImovelForm } from '../hooks/useImovelForm'
import { useAsyncStatus } from '../hooks/useAsyncStatus'

import {
  BedDouble, Bath, Square, Car, User, MapPin,
  Home, ArrowLeft, X, Image
} from 'lucide-react'

export default function AdminEditarImovel() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { papel, usuarioId, prefixo } = useSessionRole()
  const { form, setForm, handleChange, handleUpload, handleRemoveFoto, moverFoto } = useImovelForm(null)
  const { enviando, sucesso, erro, iniciarEnvio, aoSucesso, aoErro, limparErro, reset } = useAsyncStatus()

  const [loading, setLoading] = useState(true)
  const [corretores, setCorretores] = useState([])
  const [corretorSelecionado, setCorretorSelecionado] = useState('')

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await getImovelById(id)

        // Backend retorna `corretor` = nome (JOIN) e `corretor_id` = ID.
        // Usar SEMPRE corretor_id para o select.
        const corretorDoImovel = data.corretor_id != null
          ? String(data.corretor_id)
          : ''

        setForm({
          nome: data.nome ?? '',
          referencia: data.referencia ?? '',
          tipo_imovel: data.tipo_imovel ?? '',
          tipo: data.tipo ?? 'venda',
          valor: formatCurrencyInputBRL(data.valor),
          quartos: data.quartos ?? '',
          banheiros: data.banheiros ?? '',
          tamanho: data.tamanho ?? '',
          vagas: data.vagas ?? '',
          descricao: data.descricao ?? '',
          caracteristicas: data.caracteristicas ?? '',
          corretor: data.corretor_id ?? '',
          localizacao: data.localizacao ?? '',
          imagens: (Array.isArray(data.imagens) ? data.imagens : (data.imagem ? [data.imagem] : []))
            .map(criarItemImagemExistente),
        })

        if (papel === 'admin') {
          const lista = await getCorretores()
          setCorretores(lista)
          setCorretorSelecionado(corretorDoImovel || '')
        } else {
          setCorretorSelecionado(usuarioId)
          setForm(prev => ({ ...prev, corretor: usuarioId }))
        }
      } catch {
        aoErro('Não foi possível carregar os dados do imóvel.')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [id, papel, usuarioId, setForm, aoErro])

  async function handleSubmit(e) {
    e.preventDefault()
    limparErro()
    iniciarEnvio()
    try {
      const payload = {
        ...form,
        valor: parseCurrencyInputBRL(form.valor),
        quartos: form.quartos ? parseInt(form.quartos) : undefined,
        banheiros: form.banheiros ? parseInt(form.banheiros) : undefined,
        tamanho: form.tamanho ? parseFloat(form.tamanho) : undefined,
        vagas: form.vagas ? parseInt(form.vagas) : undefined,
      }
      // Sempre envia corretor explicitamente (defensivo):
      // - admin sem seleção → próprio admin
      // - admin com seleção → corretor escolhido
      // - corretor (qualquer cenário) → ele mesmo
      const extras = {
        corretor: papel === 'admin'
          ? (corretorSelecionado?.trim() || usuarioId)
          : usuarioId,
      }
      await updateImovel(id, montarFormDataImovel(payload, extras))
      aoSucesso()
      window.scrollTo(0, 0)
    } catch (err) {
      aoErro(err.message || 'Erro ao atualizar imóvel. Tente novamente.')
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
            <button onClick={reset}><X size={18} /></button>
          </div>
        )}

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span>{erro}</span>
            <button onClick={limparErro}><X size={18} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Fotos do imóvel (Máximo 20)
                <span className="block font-normal text-xs text-gray-400 mt-1">
                  A primeira foto é a capa do imóvel. Arraste as miniaturas ou use as setas para reordenar.
                </span>
              </label>
              
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-secondary transition-colors mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => handleUpload(e, () => aoErro('Você pode enviar no máximo 20 fotos por imóvel.'))}
                  className="hidden"
                />
                <Image size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Clique para selecionar fotos (Até 20)
                </p>
              </label>

              {form.imagens && form.imagens.length > 0 && (
                <GaleriaUpload
                  imagens={form.imagens}
                  onRemover={handleRemoveFoto}
                  onMover={moverFoto}
                />
              )}
            </div>

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
                  <input type="text" name="valor" value={form.valor} onChange={handleChange}
                    placeholder="Ex.: R$ 350.000" required inputMode="numeric"
                    className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>

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

            <textarea name="descricao" value={form.descricao} onChange={handleChange}
              className="w-full bg-light p-3 rounded-xl" />

            <input type="text" name="caracteristicas" value={form.caracteristicas} onChange={handleChange}
              className="w-full bg-light p-3 rounded-xl" />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {papel === 'admin' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Corretor responsável
                  </label>
                  <select
                    value={corretorSelecionado}
                    onChange={(e) => setCorretorSelecionado(e.target.value)}
                    className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {/* <option value="">— Sem corretor (atribuir ao admin) —</option> */}
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
