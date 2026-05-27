import React from 'react';
import { Navigation } from 'lucide-react'
import Map from '../components/Map'
import { useConfig } from '../context/ConfigContext'

const COORDS = { lat: -20.6750, lng: -40.5007 }

const fotos = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
]



export default function Localizacao() {
  const config = useConfig()

  function abrirMaps() {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`,
      '_blank'
    )
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Onde Estamos</span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Nossa <br /> Localização</h1>
          <p className="text-gray-500 text-lg">
            Venha nos visitar. Estamos no coração de Guarapari, prontos para te atender.
          </p>
        </div>

        {/* Fotos */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-1 block">Nossa Imobiliária</span>
              <h2 className="text-3xl font-serif font-bold text-primary">Conheça nosso espaço</h2>
            </div>
            {/* <p className="text-gray-400 text-sm hidden md:block">
             <span>
                  {config
                    ? `${config.endereco} - ${config.cidade}`
                    : '—'}
                </span>
            </p> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fotos.map((src, i) => (
              <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={src}
                  alt={`Foto da imobiliária ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="space-y-3">
          <div className="w-full h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <Map
              center={[COORDS.lat, COORDS.lng]}
              zoom={17}
              markers={[
                {
                  position: [COORDS.lat, COORDS.lng],
                  popup: "Ernany Vitorino - R. Angélica Lucarelli Amaral, 24 - Centro"
                }
              ]}
            />
          </div>
          <button
            onClick={abrirMaps}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary hover:text-primary transition-all shadow-lg uppercase tracking-widest text-sm"
          >
            <Navigation size={18} />
            Como chegar
          </button>
        </div>

      </div>
    </div>
  )
}