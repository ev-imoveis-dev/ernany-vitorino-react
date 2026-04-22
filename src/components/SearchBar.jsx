import React, { useState } from 'react';
import { Search, Home, MapPin, Tag } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    finalidade: '',
    tipo: '',
    localizacao: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        {/* Finalidade */}
        <div className="flex-1 bg-white rounded-xl flex items-center px-4 py-3">
          <Tag size={20} className="text-secondary mr-3" />
          <select
            name="finalidade"
            value={filters.finalidade}
            onChange={handleChange}
            className="w-full bg-transparent text-dark font-medium focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Finalidade</option>
            <option value="Venda">Venda</option>
            <option value="Aluguel">Aluguel</option>
          </select>
        </div>

        {/* Tipo */}
        <div className="flex-1 bg-white rounded-xl flex items-center px-4 py-3">
          <Home size={20} className="text-secondary mr-3" />
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleChange}
            className="w-full bg-transparent text-dark font-medium focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Tipo de Imóvel</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Terreno">Terreno</option>
            <option value="Comercial">Comercial</option>
          </select>
        </div>

        {/* Localização */}
        <div className="flex-[1.5] bg-white rounded-xl flex items-center px-4 py-3">
          <MapPin size={20} className="text-secondary mr-3" />
          <input
            type="text"
            name="localizacao"
            placeholder="Bairro ou Cidade"
            value={filters.localizacao}
            onChange={handleChange}
            className="w-full bg-transparent text-dark font-medium focus:outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-secondary hover:bg-opacity-90 text-primary font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
        >
          <Search size={20} />
          BUSCAR
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
