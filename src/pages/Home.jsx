import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { getImoveis } from '../services/imovelService'
import SearchBar from '../components/SearchBar'

const Home = () => {
  const navigate = useNavigate()
  const [destaques, setDestaques] = useState([])

  function handleSearch(filters) {
    const params = new URLSearchParams()
    if (filters.finalidade) params.set('tipo', filters.finalidade.toLowerCase())
    if (filters.tipo) params.set('tipo_imovel', filters.tipo)
    if (filters.localizacao) params.set('localizacao', filters.localizacao)
    navigate(`/imoveis?${params.toString()}`)
  }

  useEffect(() => {
    getImoveis()
      .then(data => setDestaques(data.slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <div className="overflow-hidden">
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Real Estate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary uppercase tracking-[0.3em] font-bold text-sm mb-6 block">
              Especialista em Alto Padrão
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">
              Encontre seu lar ideal <br />
              <span className="text-secondary italic">em Guarapari</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
              Curadoria exclusiva dos melhores imóveis no Espírito Santo.
              Experiência, segurança e sofisticação em cada detalhe.
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchBar onSearch={handleSearch} />
          </Motion.div>
        </div>
      </section>

      <section className="py-24 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
                Seleção Exclusiva
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary">Imóveis em Destaque</h2>
            </div>
            <Link
              to="/imoveis"
              className="group flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
            >
              VER TODOS OS IMÓVEIS
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {destaques.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destaques.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              Nenhum imóvel cadastrado ainda.
            </div>
          )}
        </div>
      </section>

      <section id="sobre" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 lg:col-span-2 max-w-2xl mx-auto w-full">
              <div>
                <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
                  Sobre Mim
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                  Ernany Vitorino <br />
                  <span className="text-2xl text-gray-400 font-sans font-light">
                    Corretor de Imóveis - CRECI ES2661-F
                  </span>
                  <br />
                  <span className="text-2xl text-gray-400 font-sans font-light">
                    Perito Avaliador de Imóveis - CNAI 48482
                  </span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Com uma trajetória consolidada no mercado imobiliário de Guarapari, dedico meu trabalho
                  a conectar pessoas a propriedades extraordinárias. Minha missão é oferecer um atendimento
                  personalizado, pautado na ética, transparência e excelência.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Especialista em Alto Padrão',
                  'Atendimento Personalizado',
                  'Consultoria de Investimentos',
                  'Segurança Jurídica Total',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary" size={24} />
                    <span className="font-medium text-primary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  to="/contato"
                  className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10"
                >
                  AGENDE UMA CONSULTORIA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
