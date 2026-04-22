import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="text-secondary font-serif text-2xl font-bold tracking-tighter">
              ERNANY <span className="text-white font-light">VITORINO</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Especialista em imóveis de alto padrão em Guarapari e região. 
              Sua jornada para o lar dos sonhos começa aqui.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-secondary">Links Rápidos</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-white/60 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/imoveis" className="text-white/60 hover:text-white transition-colors">Imóveis</Link></li>
              <li><Link to="/#sobre" className="text-white/60 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contato" className="text-white/60 hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-secondary">Contato</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-white/60">
                <MapPin size={20} className="text-secondary shrink-0" />
                <span>Rua Joaquim da Silva Lima, 595 - Centro - Guarapari/ES</span>
              </li>
              <li className="flex gap-3 text-white/60">
                <Phone size={20} className="text-secondary shrink-0" />
                <span>(27) 99999-9999</span>
              </li>
              <li className="flex gap-3 text-white/60">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>contato@ernanyvitorino.com.br</span>
              </li>
            </ul>
          </div>

          {/* CRECI */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-secondary">Credenciamento</h4>
            <div className="p-6 border border-secondary/30 rounded-lg bg-secondary/5">
              <span className="block text-sm uppercase tracking-widest text-secondary mb-2">CRECI</span>
              <span className="text-2xl font-bold font-serif">ES2661-F</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Ernany Vitorino Corretor de Imóveis. Todos os direitos reservados.</p>
          <p>Desenvolvido com sofisticação.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
