// src/components/PrivateRoute.jsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getSessao } from '../services/authService'

/**
 * PrivateRoute protege rotas que exigem autenticação.
 * Props:
 *  - role (opcional): string | string[] | 'admin,corretor' etc.
 *
 * Exemplo:
 *  <Route element={<PrivateRoute role={['admin','corretor']} />}>
 *    <Route path="admin/imoveis" element={<AdminImoveis />} />
 *  </Route>
 */
export default function PrivateRoute({ role }) {
  const sessao = getSessao()

  // sem sessão -> login
  if (!sessao) {
    return <Navigate to="/login" replace />
  }

  // se precisa trocar senha -> força troca
  if (sessao.trocar_senha) {
    return <Navigate to="/trocar-senha" replace />
  }

  // se role não foi passado, apenas exige autenticação
  if (!role) {
    return <Outlet />
  }

  // normaliza papel do usuário
  const papelUsuario = String(sessao.usuario?.papel || '').toLowerCase()

  // normaliza role(s) requerido(s) para array de strings lowercase
  let papeisRequeridos = []
  if (Array.isArray(role)) {
    papeisRequeridos = role.map(r => String(r).toLowerCase())
  } else {
    papeisRequeridos = String(role).split(',').map(r => r.trim().toLowerCase())
  }

  // se papel do usuário não estiver entre os permitidos -> bloqueia
  if (!papeisRequeridos.includes(papelUsuario)) {
    return <Navigate to="/login" replace />
  }

  // tudo ok -> renderiza as rotas filhas
  return <Outlet />
}
