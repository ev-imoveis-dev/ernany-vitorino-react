import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ConfigProvider } from './context/ConfigContext'
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
import AdminCorretores from './pages/AdminCorretores'
import CorretorDashboard from './pages/CorretorDashboard'
import Localizacao from './pages/Localizacao'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <ConfigProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
          error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
        }}
      />
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
            <Route path="admin/corretores" element={<AdminCorretores />} />
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
    </ConfigProvider>
  )
}

export default App
