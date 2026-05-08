import api from './api'

export async function loginUsuario(dados) {
  const { data } = await api.post('/auth/login', dados)
  return data
}

export async function esqueceuSenha(email) {
  const { data } = await api.post('/auth/esqueceu', { email })
  return data
}

export async function trocarSenha(senha_atual, nova_senha) {
  const { data } = await api.post('/auth/trocar-senha', { senha_atual, nova_senha })
  return data
}

export function salvarSessao(token, usuario, trocar_senha) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
  localStorage.setItem('trocar_senha', trocar_senha ? 'true' : 'false')
}

export function getSessao() {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  const trocarSenha = localStorage.getItem('trocar_senha') === 'true'
  if (!token || !usuario) return null

  // Verifica expiração do JWT sem biblioteca externa
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      encerrarSessao()
      return null
    }
  } catch {
    encerrarSessao()
    return null
  }

  return { token, usuario, trocar_senha: trocarSenha }
}

export function encerrarSessao() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  localStorage.removeItem('trocar_senha')
}

export function getToken() {
  return localStorage.getItem('token')
}
