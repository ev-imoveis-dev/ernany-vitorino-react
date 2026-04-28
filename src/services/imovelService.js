import { getToken } from './authService'

const BASE_URL = 'http://localhost:3333/api'

function headersAutenticados() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

/**
 * getImoveis - lista imóveis
 * params: { tipo?: string, corretorId?: number }
 * - Se passar corretorId, faz a requisição autenticada e filtra no backend (se suportado).
 * - Se não passar, retorna todos (público).
 */
export async function getImoveis(params = {}) {
  const { tipo, corretorId } = params

  // monta query string básica
  const qs = []
  if (tipo) qs.push(`tipo=${encodeURIComponent(tipo)}`)
  if (corretorId) qs.push(`corretorId=${encodeURIComponent(corretorId)}`)
  const url = `${BASE_URL}/imoveis${qs.length ? '?' + qs.join('&') : ''}`

  const options = {}
  // se for listar por corretor, usamos token (rota protegida)
  if (corretorId) {
    options.headers = headersAutenticados()
    options.cache = 'no-store'
  } else {
    // listagem pública
    options.cache = 'no-store'
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    // tenta extrair mensagem de erro
    let msg = 'Erro ao buscar imóveis'
    try {
      const err = await response.json()
      if (err && err.erro) msg = err.erro
    } catch (e) {}
    throw new Error(msg)
  }
  const data = await response.json()
  // compatibilidade: backend pode retornar { dados: [...] } ou array direto
  return data.dados ?? data ?? []
}

export async function getImovelById(id) {
  const response = await fetch(`${BASE_URL}/imoveis/${id}`)
  if (!response.ok) throw new Error('Imóvel não encontrado')
  return response.json()
}

export async function createImovel(dados) {
  const response = await fetch(`${BASE_URL}/imoveis`, {
    method: 'POST',
    headers: headersAutenticados(),
    body: JSON.stringify(dados)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.erro || 'Erro ao cadastrar imóvel')
  return data
}

export async function updateImovel(id, dados) {
  const response = await fetch(`${BASE_URL}/imoveis/${id}`, {
    method: 'PUT',
    headers: headersAutenticados(),
    body: JSON.stringify(dados)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.erro || 'Erro ao atualizar imóvel')
  return data
}

export async function deleteImovel(id) {
  const response = await fetch(`${BASE_URL}/imoveis/${id}`, {
    method: 'DELETE',
    headers: headersAutenticados()
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.erro || 'Erro ao deletar imóvel')
  return data
}
