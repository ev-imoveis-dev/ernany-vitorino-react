import api from './api'

export async function getUsuarios() {
  const { data } = await api.get('/usuarios')
  return data.dados ?? []
}

export async function getCorretores() {
  const usuarios = await getUsuarios()
  return usuarios.filter(u =>
    ['corretor', 'admin'].includes(String(u.papel || '').toLowerCase())
  )
}
