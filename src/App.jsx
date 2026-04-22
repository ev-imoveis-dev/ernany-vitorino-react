import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="imoveis" element={<PropertyList />} />
          <Route path="imoveis/:id" element={<PropertyDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contato" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
