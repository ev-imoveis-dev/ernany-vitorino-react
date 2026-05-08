import api from './api'

export async function enviarContato({ nome, email, telefone, assunto, mensagem }) {
  try {
    const { data } = await api.post('/contato', { nome, email, telefone, assunto, mensagem })
    return data
  } catch (err) {
    throw new Error(err.response?.data?.erro || 'Não foi possível enviar a mensagem. Tente novamente.')
  }
}
