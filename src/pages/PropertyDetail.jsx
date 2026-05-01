import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BedDouble, Bath, Square, Car, MapPin,
  MessageCircle, ArrowLeft, CheckCircle2, Info
} from 'lucide-react'
import Slider from 'react-slick'
import PropertyCard from '../components/PropertyCard'
import Map from '../components/Map'
import { getImovelById, getImoveis } from '../services/imovelService'
import ernanyImg from '../assets/ernany.png'

const SliderComponent = Slider.default || Slider

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  fade: true
}

export default function PropertyDetail() {
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [similares, setSimilares] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [formData, setFormData] = useState({
    nome: '', email: '', telefone: '', mensagem: ''
  })

  useEffect(() => {
    setLoading(true)
    setErro('')
    window.scrollTo(0, 0)

    getImovelById(id)
      .then(async (data) => {
        setProperty(data)
        // busca similares do mesmo tipo
        const todos = await getImoveis(data.tipo)
        setSimilares(todos.filter(item => item.id !== data.id).slice(0, 3))
      })
      .catch(() => setErro('Imóvel não encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    alert('Mensagem enviada! Ernany Vitorino entrará em contato em breve.')
    setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
  }

  if (loading) return (
    <div className="pt-40 text-center text-gray-400 text-lg">Carregando...</div>
  )

  if (erro || !property) return (
    <div className="pt-40 text-center text-red-400 text-lg">{erro || 'Imóvel não encontrado.'}</div>
  )

  const {
    nome, imagem, tipo, valor, quartos,
    banheiros, tamanho, vagas,
    descricao, caracteristicas, corretor,
    localizacao, referencia
  } = property

  const caracteristicasList = caracteristicas
    ? caracteristicas.split(',').map(c => c.trim()).filter(Boolean)
    : []

  const whatsappMessage = encodeURIComponent(
    `Olá, tenho interesse no imóvel: ${nome} (${window.location.href})`
  )

  return (
    <div className="pt-20 bg-white">

      {/* Galeria — usa imagem da API, com fallback */}
      <section className="relative h-[60vh] md:h-[80vh]">
        {imagem ? (
          <SliderComponent {...sliderSettings} className="h-full">
            {[imagem].map((foto, index) => (
              <div key={index} className="h-[60vh] md:h-[80vh] outline-none">
                <img
                  src={foto}
                  alt={`${nome} - Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </SliderComponent>
        ) : (
          <div className="w-full h-full bg-light flex items-center justify-center">
            <Square size={64} className="text-gray-200" />
          </div>
        )}

        <div className="absolute top-8 left-8 z-10">
          <Link
            to="/imoveis"
            className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-primary transition-all flex items-center gap-2 font-bold text-sm px-6"
          >
            <ArrowLeft size={20} />
            VOLTAR
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Conteúdo principal */}
          <div className="lg:col-span-2 space-y-12">

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${tipo === 'venda' ? 'bg-secondary text-primary' : 'bg-primary text-white'
                  }`}>
                  {tipo === 'venda' ? 'Venda' : 'Aluguel'}
                </span>
                {localizacao && (
                  <span className="text-gray-400 flex items-center gap-1 text-sm">
                    <MapPin size={16} />
                    {localizacao}
                  </span>
                )}
                {referencia && (
                  <span className="text-gray-400 text-xs font-mono bg-light px-3 py-1 rounded-full border border-gray-200">
                  {referencia}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">{nome}</h1>
              <div className="text-3xl font-bold text-secondary">
                {Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                {tipo === 'aluguel' && (
                  <span className="text-base text-gray-400 font-normal ml-2">/mês</span>
                )}
              </div>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-light rounded-2xl">
              {[
                { icon: BedDouble, label: 'Quartos', value: quartos ?? '—' },
                { icon: Bath, label: 'Banheiros', value: banheiros ?? '—' },
                { icon: Square, label: 'Área Total', value: tamanho ? `${tamanho}m²` : '—' },
                { icon: Car, label: 'Vagas', value: vagas ?? '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={28} className="text-secondary" />
                  <span className="text-xl font-bold text-primary">{value}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>

            {/* Descrição */}
            {descricao && (
              <div>
                <h3 className="text-2xl font-serif text-primary mb-6 border-b pb-4">
                  Descrição do Imóvel
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">{descricao}</p>
              </div>
            )}

            {/* Características */}
            {caracteristicasList.length > 0 && (
              <div>
                <h3 className="text-2xl font-serif text-primary mb-6 border-b pb-4">
                  Características
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caracteristicasList.map(item => (
                    <div key={item} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={20} className="text-secondary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Corretor */}
            {/* {corretor && (
              <div className="bg-light rounded-2xl p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary shrink-0">
                  <img
                    src={ernanyImg}
                    alt={corretor}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Corretor Responsável
                  </p>
                  <p className="text-lg font-serif font-bold text-primary">{corretor}</p>
                </div>
              </div>
            )} */}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-primary text-white p-8 rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div>
                      <h4 className="font-serif text-xl font-bold">{corretor || 'Corretor'}</h4>
                      <span className="text-secondary text-sm font-medium">Corretor Responsável</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    {[
                      { name: 'nome', type: 'text', placeholder: 'Seu Nome' },
                      { name: 'email', type: 'email', placeholder: 'Seu E-mail' },
                      { name: 'telefone', type: 'tel', placeholder: 'Seu Telefone' },
                    ].map(({ name, type, placeholder }) => (
                      <input
                        key={name}
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors placeholder:text-white/40"
                      />
                    ))}
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Mensagem"
                      rows={4}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors placeholder:text-white/40 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-secondary text-primary font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all"
                    >
                      ENVIAR MENSAGEM
                    </button>
                  </form>

                  <a
                    href={`https://wa.me/5527999999999?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <MessageCircle size={24} />
                    FALAR NO WHATSAPP
                  </a>
                </div>
              </div>

              <div className="bg-light p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                <Info className="text-secondary shrink-0" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Os valores e disponibilidades dos imóveis podem sofrer alterações sem aviso prévio.
                  Entre em contato para confirmar as informações.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similares */}
        {similares.length > 0 && (
          <section className="mt-24 pt-24 border-t">
            <h2 className="text-3xl font-serif text-primary mb-12">Imóveis Similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similares.map(item => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}