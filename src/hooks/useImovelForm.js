import { useState } from 'react'
import { formatCurrencyInputBRL } from '../utils/currency'
import { criarItemImagem } from '../utils/imovelFormData'

export const camposIniciais = {
  nome: '',
  referencia: '',
  tipo_imovel: '',
  tipo: 'venda',
  valor: '',
  quartos: '',
  banheiros: '',
  tamanho: '',
  vagas: '',
  descricao: '',
  caracteristicas: '',
  corretor: '',
  localizacao: '',
  imagens: [],
}

// onMaxFotos: callback fired when upload would exceed 20-photo limit
export function useImovelForm(inicial = camposIniciais) {
  const [form, setForm] = useState(inicial)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'valor' ? formatCurrencyInputBRL(value) : value,
    }))
  }

  function handleUpload(e, onMaxFotos) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    if (form.imagens.length + files.length > 20) {
      onMaxFotos?.()
      return
    }
    files.forEach(file => {
      setForm(prev => ({ ...prev, imagens: [...prev.imagens, criarItemImagem(file)] }))
    })
  }

  function handleRemoveFoto(index) {
    setForm(prev => ({ ...prev, imagens: prev.imagens.filter((_, i) => i !== index) }))
  }

  return { form, setForm, handleChange, handleUpload, handleRemoveFoto }
}
