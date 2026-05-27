import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BedDouble, Bath, Square, Car, MapPin,
  ArrowLeft, CheckCircle2, Info, ChevronLeft, ChevronRight
} from 'lucide-react'
import Slider from 'react-slick'
import PropertyCard from '../components/PropertyCard'
import { getImovelById, getImoveis } from '../services/imovelService'
import { listarCorretores } from '../services/corretorService'
import { getToken } from '../services/authService'
import { useConfig } from '../context/ConfigContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const CORRETORES_CACHE_KEY = 'corretores_cache'

function formatarWhatsApp(tel) {
  if (!tel) return null
  const numeros = tel.replace(/\D/g, '')
  return numeros.startsWith('55') ? numeros : `55${numeros}`
}

function normalizarTexto(value) {
  return String(value ?? '').trim().toLowerCase()
}

function encontrarCorretor(property, corretores = []) {
  const corretorId = property?.corretor_id
    || property?.corretorId
    || property?.corretor?.id
    || property?.corretor_id_usuario

  if (corretorId !== undefined && corretorId !== null) {
    const porId = corretores.find(corretor => String(corretor.id) === String(corretorId))
    if (porId) return porId
  }

  const nomeCorretor = typeof property?.corretor === 'object'
    ? property?.corretor?.nome
    : property?.corretor

  if (nomeCorretor) {
    return corretores.find(corretor => normalizarTexto(corretor.nome) === normalizarTexto(nomeCorretor))
  }

  return null
}

function obterTelefoneCorretor(property, config, corretores = []) {
  const corretorEncontrado = encontrarCorretor(property, corretores)
  const telefoneCorretor = property?.corretor?.celular
    || property?.corretor?.telefone
    || corretorEncontrado?.celular
    || corretorEncontrado?.telefone
    || property?.corretor_celular
    || property?.corretorCelular
    || property?.celular_corretor
    || property?.telefone_corretor
    || property?.telefoneCorretor
    || property?.celular

  return formatarWhatsApp(
    telefoneCorretor
    || config?.telefone1
    || config?.telefone2
    || config?.whatsapp
  )
}

function obterNomeCorretor(property) {
  if (typeof property?.corretor === 'object' && property?.corretor?.nome) {
    return property.corretor.nome
  }

  return property?.corretor || 'Corretor'
}

function validarFormularioContato(formData) {
  const errors = {}

  if (!formData.nome.trim()) errors.nome = 'Este campo é obrigatório'

  return errors
}

const SliderComponent = Slider.default || Slider

export default function PropertyDetail() {
  const { id } = useParams()
  const config = useConfig()
  const sliderRef = useRef(null)

  const [property, setProperty] = useState(null)
  const [similares, setSimilares] = useState([])
  const [corretores, setCorretores] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [fotoAtual, setFotoAtual] = useState(0)
  const [formData, setFormData] = useState({
    nome: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [whatsappError, setWhatsappError] = useState('')

  useEffect(() => {
    setLoading(true)
    setErro('')
    setFotoAtual(0)
    window.scrollTo(0, 0)

    getImovelById(id)
      .then(async (data) => {
        setProperty(data)
        const todos = await getImoveis(data.tipo)
        setSimilares(todos.filter(item => item.id !== data.id).slice(0, 3))
      })
      .catch(() => setErro('Imóvel não encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    try {
      const cache = JSON.parse(localStorage.getItem(CORRETORES_CACHE_KEY) || '[]')
      if (Array.isArray(cache) && cache.length > 0) setCorretores(cache)
    } catch {
      setCorretores([])
    }

    if (!getToken()) return

    listarCorretores()
      .then(res => {
        const lista = Array.isArray(res) ? res : (res?.dados ?? [])
        setCorretores(Array.isArray(lista) ? lista : [])
        if (Array.isArray(lista)) {
          localStorage.setItem(CORRETORES_CACHE_KEY, JSON.stringify(lista))
        }
      })
      .catch(() => setCorretores([]))
  }, [])

  const metaTitulo = property
    ? `${property.nome} — ${Number(property.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} | Ernany Vitorino Imóveis`
    : null
  const metaDescricao = property
    ? (property.descricao ? property.descricao.slice(0, 155) : `${property.tipo_imovel || 'Imóvel'} à ${property.tipo} em ${property.localizacao || 'Guarapari/ES'}`)
    : null
  const metaImagem = property
    ? (Array.isArray(property.imagens) && property.imagens.length > 0 ? property.imagens[0] : property.imagem)
    : null
  useDocumentMeta({ title: metaTitulo, description: metaDescricao, imageUrl: metaImagem, url: window.location.href })

  function handleChange(e) {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
    setWhatsappError('')
  }

  function handleBlur(e) {
    const { name } = e.target
    const errors = validarFormularioContato(formData)
    setFormErrors(prev => ({ ...prev, [name]: errors[name] || '' }))
  }

  function handleWhatsAppClick() {
    const errors = validarFormularioContato(formData)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    const numero = obterTelefoneCorretor(property, config, corretores)
    if (!numero) {
      setWhatsappError('Não há um número de WhatsApp disponível no momento.')
      return
    }

    const referenciaImovel = property?.referencia ? ` Referência: ${property.referencia}.` : ''
    const texto = encodeURIComponent(
      `Olá! Me chamo ${formData.nome.trim()}, gostaria de falar sobre o imóvel ${property?.nome || 'selecionado'}.${referenciaImovel}`
    )

    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  if (loading) return (
    <div className="pt-40 text-center text-gray-400 text-lg">Carregando...</div>
  )

  if (erro || !property) return (
    <div className="pt-40 text-center text-red-400 text-lg">{erro || 'Imóvel não encontrado.'}</div>
  )

  const {
    nome, imagens, imagem, tipo, valor, quartos,
    banheiros, tamanho, vagas,
    descricao, caracteristicas, localizacao, referencia
  } = property

  const nomeCorretor = obterNomeCorretor(property)

  const listaImagens = Array.isArray(imagens) && imagens.length > 0
    ? imagens
    : (imagem ? [imagem] : [])

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: listaImagens.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: listaImagens.length > 1,
    fade: true,
    afterChange: setFotoAtual
  }

  const caracteristicasList = caracteristicas
    ? caracteristicas.split(',').map(c => c.trim()).filter(Boolean)
    : []

  return (
    <div className="pt-20 bg-white">
      <section className="relative h-[60vh] md:h-[80vh]">
        {listaImagens.length > 0 ? (
          <>
            <SliderComponent ref={sliderRef} {...sliderSettings} className="h-full">
              {listaImagens.map((foto, index) => (
                <div key={index} className="h-[60vh] md:h-[80vh] outline-none">
                  <img
                    src={foto}
                    alt={`${nome} - Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </SliderComponent>

            {listaImagens.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => sliderRef.current?.slickPrev()}
                  aria-label="Foto anterior"
                  className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 w-12 h-12 rounded-full bg-white/85 text-primary shadow-lg backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  type="button"
                  onClick={() => sliderRef.current?.slickNext()}
                  aria-label="Próxima foto"
                  className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 w-12 h-12 rounded-full bg-white/85 text-primary shadow-lg backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight size={28} />
                </button>

                <div className="absolute bottom-6 right-4 md:right-8 z-20 rounded-full bg-black/55 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                  {fotoAtual + 1} / {listaImagens.length}
                </div>
              </>
            )}
          </>
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
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${tipo === 'venda' ? 'bg-secondary text-primary' : 'bg-primary text-white'}`}>
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

            {descricao && (
              <div>
                <h3 className="text-2xl font-serif text-primary mb-6 border-b pb-4">
                  Descrição do Imóvel
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">{descricao}</p>
              </div>
            )}

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
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-primary text-white p-8 rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div>
                      <h4 className="font-serif text-xl font-bold">{nomeCorretor}</h4>
                      <span className="text-secondary text-sm font-medium">Corretor Responsável</span>
                    </div>
                  </div>

                  <form className="space-y-4 mb-8" noValidate>
                    <div>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Seu Nome"
                        className={`w-full bg-white/10 border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors placeholder:text-white/40 ${
                          formErrors.nome ? 'border-red-400' : 'border-white/20'
                        }`}
                      />
                      {formErrors.nome && (
                        <p className="mt-2 text-sm text-red-300">{formErrors.nome}</p>
                      )}
                    </div>
                  </form>

                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    FALAR NO WHATSAPP
                  </button>
                  {whatsappError && (
                    <p className="mt-3 text-sm text-red-300">{whatsappError}</p>
                  )}
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
