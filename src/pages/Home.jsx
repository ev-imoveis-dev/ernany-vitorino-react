import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { getImoveis } from '../services/imovelService'
import ernanyImg from '../assets/ernany.png'
import SearchBar from '../components/SearchBar'

const Home = () => {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    getImoveis()
      .then(data => setDestaques(data.slice(0, 3)))
      .catch(() => { })
  }, [])

  return (
    <div className="overflow-hidden">

      {/* Hero */}
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
          <motion.div
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <SearchBar />
          </motion.div>
        </div>

      </section>

      {/* Imóveis em Destaque */}
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

      {/* Sobre */}
      <section id="sobre" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white p-3 border border-gray-100 relative z-10">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50">
                  <img
                    src={ernanyImg}
                    alt="Ernany Vitorino"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-0" />
              <div className="absolute -bottom-10 -right-10 bg-secondary p-12 rounded-2xl hidden md:block z-20 shadow-xl">
                <span className="block text-5xl font-serif text-primary font-bold mb-2">15+</span>
                <span className="text-primary/80 font-bold uppercase tracking-widest text-xs leading-tight">
                  Anos de <br /> Experiência
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">
                  Sobre Mim
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                  Ernany Vitorino <br />
                  <span className="text-2xl text-gray-400 font-sans font-light">
                    Corretor de Imóveis - CRECI ES2661-F
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
                  'Segurança Jurídica Total'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary" size={24} />
                    <span className="font-medium text-primary">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/contato"
                className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/10"
              >
                AGENDE UMA CONSULTORIA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,0 L100,0 L100,100 Z" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-primary mb-8">
            Pronto para encontrar seu <br className="hidden md:block" /> próximo endereço de luxo?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5527999999999"
              className="bg-primary text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-dark transition-all shadow-2xl"
            >
              FALAR NO WHATSAPP
            </a>
            <Link
              to="/imoveis"
              className="bg-white text-primary px-12 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl"
            >
              VER TODOS OS IMÓVEIS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home