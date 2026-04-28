// const BASE_URL = 'http://localhost:3333/api'

// export async function loginUsuario(dados) {
//   const response = await fetch(`${BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(dados)
//   })
//   const data = await response.json()
//   if (!response.ok) throw new Error(data.erro || 'Erro ao fazer login.')
//   return data
// }

// export async function esqueceuSenha(email) {
//   const response = await fetch(`${BASE_URL}/auth/esqueceu`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email })
//   })
//   const data = await response.json()
//   if (!response.ok) throw new Error(data.erro || 'Erro ao solicitar recuperação.')
//   return data
// }

// export async function trocarSenha(senha_atual, nova_senha) {
//   const response = await fetch(`${BASE_URL}/auth/trocar-senha`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${getToken()}`
//     },
//     body: JSON.stringify({ senha_atual, nova_senha })
//   })
//   const data = await response.json()
//   if (!response.ok) throw new Error(data.erro || 'Erro ao trocar senha.')
//   return data
// }

// export function salvarSessao(token, usuario) {
//   localStorage.setItem('token', token)
//   localStorage.setItem('usuario', JSON.stringify(usuario))
// }

// export function getSessao() {
//   const token = localStorage.getItem('token')
//   const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
//   if (!token || !usuario) return null
//   return { token, usuario }
// }

// export function encerrarSessao() {
//   localStorage.removeItem('token')
//   localStorage.removeItem('usuario')
// }

// export function getToken() {
//   return localStorage.getItem('token')
// }

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

export async function esqueceuSenha(email) {
  const response = await fetch(`${BASE_URL}/auth/esqueceu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.erro || 'Erro ao solicitar recuperação.')
  return data
}

export async function trocarSenha(senha_atual, nova_senha) {
  const response = await fetch(`${BASE_URL}/auth/trocar-senha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ senha_atual, nova_senha })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.erro || 'Erro ao trocar senha.')
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
