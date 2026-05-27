import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { getImoveis } from '../services/imovelService'
import { useConfig } from '../context/ConfigContext'
import ernanyImg from '../assets/ernany.png'
import SearchBar from '../components/SearchBar'

function formatarWhatsApp(tel) {
  if (!tel) return null
  const numeros = tel.replace(/\D/g, '')
  return numeros.startsWith('55') ? numeros : `55${numeros}`
}

const Home = () => {
  const navigate = useNavigate()
  const config = useConfig()
  const whatsappNumero = formatarWhatsApp(config?.telefone1)

  function handleSearch(filters) {
    const params = new URLSearchParams()
    if (filters.finalidade) params.set('tipo', filters.finalidade.toLowerCase())
    if (filters.tipo) params.set('tipo_imovel', filters.tipo)
    if (filters.localizacao) params.set('localizacao', filters.localizacao)
    navigate(`/imoveis?${params.toString()}`)
  }
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
            <SearchBar onSearch={handleSearch} />
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
              {/* <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white p-3 border border-gray-100 relative z-10">
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
                <span className="block text-5xl font-serif text-primary font-bold mb-2">30+</span>
                <span className="text-primary/80 font-bold uppercase tracking-widest text-xs leading-tight">
                  Anos de <br /> Experiência
                </span>
              </div> */}
            </div>

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
            Pronto para encontrar seu <br className="hidden md:block" /> próximo endereço?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {whatsappNumero && (
              <a
                href={`https://wa.me/${whatsappNumero}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-dark transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                FALAR NO WHATSAPP
              </a>
            )}
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