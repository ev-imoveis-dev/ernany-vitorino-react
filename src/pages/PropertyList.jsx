import React, { useState, useMemo, useEffect } from 'react';
import { getImoveis } from '../services/imovelService';
import PropertyCard from '../components/PropertyCard';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const PropertyList = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    finalidade: 'Todos',
    tipo: 'Todos',
    bairro: '',
    quartos: 'Todos',
    ordem: 'recentes'
  });

useEffect(() => {
  getImoveis()
    .then(data => {
      const adaptados = data.map(item => ({
        ...item,
        titulo: item.nome,
        preco: item.valor,
        bairro: item.localizacao,
        cidade: 'Guarapari',
        fotos: [item.imagem],
        finalidade: item.tipo === 'venda' ? 'Venda' : 'Aluguel',
        area: item.tamanho,
        destaque: false,
        tipo: 'Imóvel',
      }))
      setImoveis(adaptados)
    })
    .catch(() => setErro('Não foi possível carregar os imóveis.'))
    .finally(() => setLoading(false))
}, [])

  const filteredImoveis = useMemo(() => {
    return imoveis.filter(item => {
      const matchFinalidade = filters.finalidade === 'Todos' || item.finalidade?.toLowerCase() === filters.finalidade.toLowerCase();
      const matchTipo = filters.tipo === 'Todos' || item.tipo === filters.tipo;
      const matchBairro = filters.bairro === '' || item.bairro?.toLowerCase().includes(filters.bairro.toLowerCase());
      const matchQuartos = filters.quartos === 'Todos' || (filters.quartos === '4+' ? item.quartos >= 4 : item.quartos === parseInt(filters.quartos));
      return matchFinalidade && matchTipo && matchBairro && matchQuartos;
    }).sort((a, b) => {
      if (filters.ordem === 'menor_preco') return a.preco - b.preco;
      if (filters.ordem === 'maior_preco') return b.preco - a.preco;
      return b.id - a.id;
    });
  }, [imoveis, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return (
    <div className="pt-32 pb-24 bg-light min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Carregando imóveis...</p>
    </div>
  );

  if (erro) return (
    <div className="pt-32 pb-24 bg-light min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-lg">{erro}</p>
    </div>
  );

  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Nossos Imóveis</h1>
          <p className="text-gray-500">{filteredImoveis.length} imóveis encontrados</p>
        </div>

        <div className="lg:hidden flex gap-4 mb-8">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-2 font-bold text-primary"
          >
            <Filter size={20} className="text-secondary" />
            FILTRAR
          </button>
          <div className="flex-1 bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-2">
            <select
              value={filters.ordem}
              onChange={(e) => handleFilterChange('ordem', e.target.value)}
              className="bg-transparent font-bold text-primary focus:outline-none w-full text-center"
            >
              <option value="recentes">MAIS RECENTES</option>
              <option value="menor_preco">MENOR PREÇO</option>
              <option value="maior_preco">MAIOR PREÇO</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-80 space-y-8 sticky top-32 h-fit">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
                <SlidersHorizontal size={20} className="text-secondary" />
                <h3 className="text-lg font-bold text-primary uppercase tracking-widest">Filtros</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Finalidade</label>
                  <div className="flex flex-wrap gap-2">
                    {['Todos', 'Venda', 'Aluguel'].map(option => (
                      <button key={option} onClick={() => handleFilterChange('finalidade', option)}
                        className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          filters.finalidade === option ? "bg-primary text-white" : "bg-light text-gray-500 hover:bg-gray-200")}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tipo de Imóvel</label>
                  <select value={filters.tipo} onChange={(e) => handleFilterChange('tipo', e.target.value)}
                    className="w-full bg-light p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary">
                    <option value="Todos">Todos os tipos</option>
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Localização</label>
                  <input type="text" placeholder="Ex: Praia do Morro" value={filters.bairro}
                    onChange={(e) => handleFilterChange('bairro', e.target.value)}
                    className="w-full bg-light p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quartos</label>
                  <div className="flex flex-wrap gap-2">
                    {['Todos', '1', '2', '3', '4+'].map(option => (
                      <button key={option} onClick={() => handleFilterChange('quartos', option)}
                        className={cn("w-10 h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                          filters.quartos === option ? "bg-primary text-white" : "bg-light text-gray-500 hover:bg-gray-200")}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setFilters({ finalidade: 'Todos', tipo: 'Todos', bairro: '', quartos: 'Todos', ordem: 'recentes' })}
                  className="w-full py-3 text-sm font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">
                  Limpar Filtros
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="hidden lg:flex justify-end mb-8">
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
                <span className="text-sm text-gray-400 font-medium">ORDENAR POR:</span>
                <select value={filters.ordem} onChange={(e) => handleFilterChange('ordem', e.target.value)}
                  className="bg-transparent font-bold text-primary focus:outline-none cursor-pointer">
                  <option value="recentes">Mais recentes</option>
                  <option value="menor_preco">Menor preço</option>
                  <option value="maior_preco">Maior preço</option>
                </select>
              </div>
            </div>

            {filteredImoveis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredImoveis.map(item => (
                  <PropertyCard key={item.id} property={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-2xl text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter size={32} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-serif text-primary mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros para encontrar o que procura.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-serif text-primary">Filtros</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-light rounded-full"><X size={24} /></button>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Finalidade</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Todos', 'Venda', 'Aluguel'].map(option => (
                      <button key={option} onClick={() => handleFilterChange('finalidade', option)}
                        className={cn("py-3 rounded-xl text-sm font-bold transition-all",
                          filters.finalidade === option ? "bg-primary text-white shadow-lg" : "bg-light text-gray-500")}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tipo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial'].map(option => (
                      <button key={option} onClick={() => handleFilterChange('tipo', option)}
                        className={cn("py-3 rounded-xl text-sm font-bold transition-all",
                          filters.tipo === option ? "bg-primary text-white shadow-lg" : "bg-light text-gray-500")}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Localização</label>
                  <input type="text" placeholder="Bairro ou Cidade" value={filters.bairro}
                    onChange={(e) => handleFilterChange('bairro', e.target.value)}
                    className="w-full bg-light p-4 rounded-xl text-base focus:outline-none" />
                </div>
                <button onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-secondary text-primary font-bold py-5 rounded-xl shadow-xl shadow-secondary/20 mt-8">
                  VER {filteredImoveis.length} RESULTADOS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyList;