import { useEffect, useRef, useState } from 'react'
import { formatCurrencyInputBRL } from '../utils/currency'
import { criarItemImagem, revogarPreview } from '../utils/imovelFormData'

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

  // Espelha as imagens atuais para o cleanup do unmount revogar os previews
  // que ainda estiverem na tela.
  const imagensRef = useRef(form?.imagens)
  useEffect(() => {
    imagensRef.current = form?.imagens
  }, [form])

  useEffect(() => {
    return () => {
      imagensRef.current?.forEach(revogarPreview)
    }
  }, [])

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
    revogarPreview(form?.imagens?.[index])
    setForm(prev => ({ ...prev, imagens: prev.imagens.filter((_, i) => i !== index) }))
  }

  // Volta o formulario para `valor`, liberando os previews do estado anterior.
  function limparForm(valor) {
    form?.imagens?.forEach(revogarPreview)
    setForm(valor)
  }

  // Reordena as fotos: a primeira da lista e a capa do imovel.
  function moverFoto(origem, destino) {
    setForm(prev => {
      if (!prev || !Array.isArray(prev.imagens)) return prev

      const total = prev.imagens.length
      if (origem === destino) return prev
      if (origem < 0 || origem >= total) return prev
      if (destino < 0 || destino >= total) return prev

      const imagens = [...prev.imagens]
      const [movida] = imagens.splice(origem, 1)
      imagens.splice(destino, 0, movida)

      return { ...prev, imagens }
    })
  }

  return { form, setForm, limparForm, handleChange, handleUpload, handleRemoveFoto, moverFoto }
}
