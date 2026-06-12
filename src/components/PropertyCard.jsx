import React from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Bath, Square, Car, ArrowRight, MapPin } from 'lucide-react'
import { motion as Motion } from 'framer-motion'
import { cn } from '../utils/cn'

const PropertyCard = ({ property }) => {
  const {
    id,
    nome,
    imagens,
    imagem,
    tipo,
    valor,
    quartos,
    banheiros,
    tamanho,
    vagas,
    localizacao,
    referencia,
  } = property

  const fotoExibicao = Array.isArray(imagens) && imagens.length > 0
    ? imagens[0]
    : imagem

  return (
    <Motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
    >
      <Link to={`/imoveis/${id}`} className="block relative aspect-[4/3] overflow-hidden">
        {fotoExibicao ? (
          <img
            src={fotoExibicao}
            alt={nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-light flex items-center justify-center">
            <Square size={48} className="text-gray-200" />
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className={cn(
            'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
            tipo === 'venda' ? 'bg-secondary text-primary' : 'bg-primary text-white',
          )}>
            {tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>
      </Link>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-serif font-bold text-dark group-hover:text-secondary transition-colors line-clamp-1">
              {nome}
            </h3>
            {referencia && (
              <span className="text-gray-400 text-xs font-mono bg-light px-3 py-1 rounded-full border border-gray-200 whitespace-nowrap shrink-0">
                {referencia}
              </span>
            )}
          </div>
          {localizacao && (
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-secondary shrink-0" />
              {localizacao}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-primary">
            {Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {tipo === 'aluguel' && (
            <span className="text-xs text-gray-400 font-medium">/mês</span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="flex flex-col items-center gap-1">
            <BedDouble size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">
              {quartos ?? '—'} Quartos
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">
              {banheiros ?? '—'} Banheiros
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">
              {tamanho ?? '—'}m²
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Car size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">
              {vagas ?? '—'} Vagas
            </span>
          </div>
        </div>

        <Link
          to={`/imoveis/${id}`}
          className="w-full py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
        >
          VER DETALHES
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Motion.div>
  )
}

export default PropertyCard
