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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="imoveis" element={<PropertyList />} />
          <Route path="imoveis/:id" element={<PropertyDetail />} />
          <Route path="contato" element={<Contact />} />
          <Route path="admin" element={<AdminDashboard />} /> // Painel Admin
          <Route path="admin/imoveis" element={<AdminImoveis />} /> // Listagem de Imóveis Admin
          <Route path="admin/cadastrar" element={<Admin />} /> // Cadastro de Imóvel Admin
          <Route path="admin/configuracoes" element={<AdminConfiguracoes />} /> // Informações do Site Admin
          <Route path="login" element={<Login />} />
          <Route path="cadastro-corretor" element={<CadastroCorretor />} /> // Cadastro de Corretor Admin
          <Route path="esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="trocar-senha" element={<TrocarSenha />} /> 
        </Route>
      </Routes>
    </Router>
  )
}

export default App