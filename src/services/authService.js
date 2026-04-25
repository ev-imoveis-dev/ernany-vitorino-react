const BASE_URL = 'http://localhost:3333/api'

export async function loginUsuario(dados) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.erro || 'Erro ao fazer login.')
  return data
}

export function salvarSessao(token, usuario) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

export function getSessao() {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  if (!token || !usuario) return null
  return { token, usuario }
}

export function encerrarSessao() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function getToken() {
  return localStorage.getItem('token')
}