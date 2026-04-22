import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { imoveis } from '../data/imoveis';
import { 
  BedDouble, Bath, Square, Car, MapPin, Share2, 
  Heart, MessageCircle, ArrowLeft, CheckCircle2,
  Calendar, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import PropertyCard from '../components/PropertyCard';
import { cn } from '../utils/cn';
import Map from '../components/Map';

const SliderComponent = Slider.default || Slider;

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarImoveis, setSimilarImoveis] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Interesse no imóvel:', property.titulo, formData);
    alert('Mensagem enviada! Ernany Vitorino entrará em contato em breve.');
    setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
  };

  useEffect(() => {
    const found = imoveis.find(item => item.id === parseInt(id));
    if (found) {
      setProperty(found);
      setSimilarImoveis(imoveis.filter(item => item.id !== found.id && item.tipo === found.tipo).slice(0, 3));
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!property) return <div className="pt-40 text-center">Carregando...</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true
  };

  const whatsappMessage = encodeURIComponent(`Olá, tenho interesse no imóvel: ${property.titulo} (${window.location.href})`);

  return (
    <div className="pt-20 bg-white">
      {/* Photo Gallery */}
      <section className="relative h-[60vh] md:h-[80vh]">
        <SliderComponent {...sliderSettings} className="h-full">
          {property.fotos.map((foto, index) => (
            <div key={index} className="h-[60vh] md:h-[80vh] outline-none">
              <img
                src={foto}
                alt={`${property.titulo} - Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </SliderComponent>
        
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-secondary text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  {property.finalidade}
                </span>
                <span className="text-gray-400 flex items-center gap-1 text-sm">
                  <MapPin size={16} />
                  {property.bairro}, {property.cidade} - {property.estado}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">{property.titulo}</h1>
              <div className="text-3xl font-bold text-secondary">
                {property.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-light rounded-2xl">
              <div className="flex flex-col items-center gap-2 text-center">
                <BedDouble size={28} className="text-secondary" />
                <span className="text-xl font-bold text-primary">{property.quartos}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Quartos</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Bath size={28} className="text-secondary" />
                <span className="text-xl font-bold text-primary">{property.banheiros}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Banheiros</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Square size={28} className="text-secondary" />
                <span className="text-xl font-bold text-primary">{property.area}m²</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Área Total</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Car size={28} className="text-secondary" />
                <span className="text-xl font-bold text-primary">{property.vagas}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Vagas</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-serif text-primary mb-6 border-b pb-4">Descrição do Imóvel</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.descricao}
              </p>
            </div>

            {/* Amenities (Mock) */}
            <div>
              <h3 className="text-2xl font-serif text-primary mb-6 border-b pb-4">Características</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Acabamento de luxo",
                  "Ar condicionado",
                  "Área gourmet",
                  "Varanda com vista",
                  "Mobiliado",
                  "Segurança 24h"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 size={20} className="text-secondary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location (Mock Map) */}
            <div>
              <h3 className="text-2xl font-serif text-primary mb-6 border-b pb-4">Localização</h3>
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative">
                <Map 
                  center={[property.coordenadas.lat, property.coordenadas.lng]} 
                  zoom={15}
                  markers={[
                    { 
                      position: [property.coordenadas.lat, property.coordenadas.lng], 
                      popup: property.titulo 
                    }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Contact */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-primary text-white p-8 rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary p-1 bg-white shadow-lg">
                      <img 
                        src="/src/assets/ernany.png" 
                        alt="Ernany Vitorino"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold">Ernany Vitorino</h4>
                      <span className="text-secondary text-sm font-medium">Corretor Responsável</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    <input 
                      type="text" 
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu Nome"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      required
                    />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Seu E-mail"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      required
                    />
                    <input 
                      type="tel" 
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="Seu Telefone"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      required
                    />
                    <textarea 
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Mensagem"
                      rows="4"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      required
                    ></textarea>
                    <button type="submit" className="w-full bg-secondary text-primary font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all">
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
                  Os valores e disponibilidades dos imóveis podem sofrer alterações sem aviso prévio. Entre em contato para confirmar as informações.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Properties */}
        {similarImoveis.length > 0 && (
          <section className="mt-24 pt-24 border-t">
            <h2 className="text-3xl font-serif text-primary mb-12">Imóveis Similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarImoveis.map(item => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
