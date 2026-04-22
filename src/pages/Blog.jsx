import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Como financiar seu primeiro imóvel de luxo",
      summary: "Entenda as melhores taxas e condições para adquirir sua propriedade de alto padrão em Guarapari.",
      date: "15 Abr, 2026",
      category: "Finanças",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Melhores bairros de Guarapari para morar",
      summary: "Descubra por que a Enseada Azul e a Praia do Morro continuam sendo as favoritas dos investidores.",
      date: "10 Abr, 2026",
      category: "Localização",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Dicas para valorizar seu imóvel na hora da venda",
      summary: "Pequenos detalhes no acabamento e na decoração que podem aumentar o valor de mercado da sua casa.",
      date: "05 Abr, 2026",
      category: "Dicas",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Nosso Blog</span>
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Conteúdo Exclusivo</h1>
          <p className="text-gray-500 text-lg">
            Fique por dentro das novidades do mercado imobiliário e dicas exclusivas para viver bem em Guarapari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs font-bold text-secondary uppercase tracking-widest mb-4">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-primary mb-4 group-hover:text-secondary transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 mb-6 line-clamp-2">
                  {post.summary}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-4 transition-all"
                >
                  LER MAIS <ArrowRight size={16} className="text-secondary" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
