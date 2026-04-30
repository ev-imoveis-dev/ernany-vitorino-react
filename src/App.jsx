import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import CadastroCorretor from './pages/CadastroCorretor'
import EsqueceuSenha from './pages/EsqueceuSenha'
import TrocarSenha from './pages/TrocarSenha'
import AdminDashboard from './pages/AdminDashboard'
import AdminImoveis from './pages/AdminImoveis'
import AdminConfiguracoes from './pages/AdminConfiguracoes'
import AdminEditarImovel from './pages/AdminEditarImovel'
import CorretorDashboard from './pages/CorretorDashboard'
import Localizacao from './pages/Localizacao'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rotas públicas */}
          <Route index element={<Home />} />
          <Route path="imoveis" element={<PropertyList />} />
          <Route path="imoveis/:id" element={<PropertyDetail />} />
          <Route path="contato" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="trocar-senha" element={<TrocarSenha />} />
          <Route path="localizacao" element={<Localizacao />} />

          {/* Rotas exclusivas do Admin */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/imoveis" element={<AdminImoveis />} />
            <Route path="admin/cadastrar" element={<Admin />} />
            <Route path="admin/editar/:id" element={<AdminEditarImovel />} />
            <Route path="admin/configuracoes" element={<AdminConfiguracoes />} />
            <Route path="cadastro-corretor" element={<CadastroCorretor />} />
          </Route>

          {/* Rotas exclusivas do Corretor */}
          <Route element={<PrivateRoute role="corretor" />}>
            <Route path="corretor" element={<CorretorDashboard />} />
            <Route path="corretor/imoveis" element={<AdminImoveis />} />
            <Route path="corretor/cadastrar" element={<Admin />} />
            <Route path="corretor/editar/:id" element={<AdminEditarImovel />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
