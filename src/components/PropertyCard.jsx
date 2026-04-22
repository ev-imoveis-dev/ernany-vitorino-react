import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square, Car, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const PropertyCard = ({ property }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
    >
      <Link to={`/imoveis/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={property.fotos[0]}
          alt={property.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            property.finalidade === 'Venda' ? "bg-secondary text-primary" : "bg-primary text-white"
          )}>
            {property.finalidade}
          </span>
          {property.destaque && (
            <span className="bg-dark text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Destaque
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-serif font-bold text-dark group-hover:text-secondary transition-colors line-clamp-1">
            {property.titulo}
          </h3>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {property.bairro}, {property.cidade}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-primary">
            {property.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="flex flex-col items-center gap-1">
            <BedDouble size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">{property.quartos} qts</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">{property.banheiros} ban</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">{property.area}m²</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Car size={18} className="text-secondary" />
            <span className="text-xs text-gray-600 font-medium">{property.vagas} vg</span>
          </div>
        </div>

        <Link
          to={`/imoveis/${property.id}`}
          className="w-full py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
        >
          VER DETALHES
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
