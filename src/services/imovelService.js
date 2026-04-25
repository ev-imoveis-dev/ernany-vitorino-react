import { getToken } from './authService'

const BASE_URL = 'http://localhost:3333/api'

function headersAutenticados() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

export async function getImoveis(tipo = '') {
  const url = tipo ? `${BASE_URL}/imoveis?tipo=${tipo}` : `${BASE_URL}/imoveis`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Erro ao buscar imóveis')
  const data = await response.json()
  return data.dados ?? []
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