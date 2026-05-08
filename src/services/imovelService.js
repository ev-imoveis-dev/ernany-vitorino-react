import api from './api'

export async function getImoveis(params = {}) {
  const { tipo, corretorId, page, limit } = params
  const { data } = await api.get('/imoveis', { params: { tipo, corretorId, page, limit } })
  if (!data || !Array.isArray(data.dados)) {
    throw new Error('Resposta inesperada do servidor ao carregar imóveis.')
  }
  return data.dados
}

export async function getImovelById(id) {
  const { data } = await api.get(`/imoveis/${id}`)
  return data
}

export async function createImovel(dados) {
  const { data } = await api.post('/imoveis', dados)
  return data
}

export async function updateImovel(id, dados) {
  const { data } = await api.put(`/imoveis/${id}`, dados)
  return data
}

export async function deleteImovel(id) {
  const { data } = await api.delete(`/imoveis/${id}`)
  return data
}
