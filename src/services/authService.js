import api from './api'

export async function loginUsuario(dados) {
  const { data } = await api.post('/auth/login', dados)
  return data
}

export async function esqueceuSenha(email) {
  const { data } = await api.post('/auth/esqueceu', { email })
  return data
}

export async function redefinirSenha(token, nova_senha) {
  const { data } = await api.post('/auth/redefinir-senha', { token, nova_senha })
  return data
}

export async function trocarSenha(senha_atual, nova_senha) {
  const { data } = await api.post('/auth/trocar-senha', { senha_atual, nova_senha })
  return data
}

/**
 * Persiste informacoes nao-sensiveis do usuario para uso na UI (nome, papel).
 * O token de autenticacao NAO e salvo em localStorage — vive em cookie HttpOnly
 * setado pelo backend no login, inacessivel ao JS (protecao contra XSS).
 */
export function salvarSessao(usuario, trocar_senha) {
  localStorage.setItem('usuario', JSON.stringify(usuario))
  localStorage.setItem('trocar_senha', trocar_senha ? 'true' : 'false')
}

/**
 * Retorna informacoes de UI da sessao. NAO valida o token — o backend e a fonte
 * da verdade. Front usa isso so para gating de UI / labels. Qualquer 401 do back
 * dispara encerrarSessao() via interceptor de api.js.
 */
export function getSessao() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
    const trocarSenha = localStorage.getItem('trocar_senha') === 'true'
    if (!usuario) return null
    return { usuario, trocar_senha: trocarSenha }
  } catch {
    localStorage.removeItem('usuario')
    localStorage.removeItem('trocar_senha')
    return null
  }
}

export function encerrarSessao() {
  localStorage.removeItem('usuario')
  localStorage.removeItem('trocar_senha')
  // Limpa cookie HttpOnly via backend. Best-effort — se rede falhar, cookie
  // expira pelo maxAge (2h) ou pela proxima requisicao 401.
  api.post('/auth/logout').catch(() => {})
}
