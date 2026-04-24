const BASE_URL = 'http://localhost:3333/api'

export async function getImoveis(tipo = '') {
  const url = tipo ? `${BASE_URL}/imoveis?tipo=${tipo}` : `${BASE_URL}/imoveis`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Erro ao buscar imóveis')
  return response.json()
}

export async function getImovelById(id) {
  const response = await fetch(`${BASE_URL}/imoveis/${id}`)
  if (!response.ok) throw new Error('Imóvel não encontrado')
  return response.json()
}

export async function createImovel(dados) {
  const response = await fetch(`${BASE_URL}/imoveis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  if (!response.ok) throw new Error('Erro ao cadastrar imóvel')
  return response.json()
}

export async function updateImovel(id, dados) {
  const response = await fetch(`${BASE_URL}/imoveis/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  if (!response.ok) throw new Error('Erro ao atualizar imóvel')
  return response.json()
}

export async function deleteImovel(id) {
  const response = await fetch(`${BASE_URL}/imoveis/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Erro ao deletar imóvel')
  return response.json()
}