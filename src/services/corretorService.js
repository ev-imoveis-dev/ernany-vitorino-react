import api from './api'

export async function cadastrarCorretor(dados) {
  const { data } = await api.post('/auth/registrar-corretor', dados)
  return data
}
