import api from './api'

export async function cadastrarCorretor(dados) {
  try {
    const { data } = await api.post('/auth/registrar-corretor', dados)
    return data
  } catch (err) {
    throw new Error(err.response?.data?.erro || 'Erro ao cadastrar corretor.')
  }
}

export async function listarCorretores() {
  try {
    const { data } = await api.get('/admin/corretores')
    return data
  } catch (err) {
    throw new Error(err.response?.data?.erro || 'Erro ao carregar corretores.')
  }
}

export async function atualizarCorretor(id, dados) {
  try {
    const { data } = await api.put(`/admin/corretores/${id}`, dados)
    return data
  } catch (err) {
    throw new Error(err.response?.data?.erro || 'Erro ao atualizar corretor.')
  }
}

export async function enviarNovaSenha(id) {
  try {
    const { data } = await api.post(`/admin/corretores/${id}/nova-senha`)
    return data
  } catch (err) {
    throw new Error(err.response?.data?.erro || 'Erro ao enviar nova senha.')
  }
}
