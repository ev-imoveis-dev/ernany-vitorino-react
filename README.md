# Ernany Imóveis

Plataforma web completa para gestão de imóveis, desenvolvida com React e focada em experiência do usuário para corretores e clientes do mercado imobiliário.

## 🚀 Demonstração

> Em breve: Link do deploy e screenshots

![Preview](https://via.placeholder.com/800x400?text=Ernany+Im%C3%B3veis+Preview)

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| **Frontend** | React 19, React Router DOM 7 |
| **Build Tool** | Vite 8 |
| **Estilização** | Tailwind CSS 3.4, CSS Modules |
| **HTTP Client** | Axios |
| **Mapas** | Leaflet, React-Leaflet |
| **Animações** | Framer Motion 12 |
| **Ícones** | Lucide React |
| **Carrossel** | React Slick, Slick Carousel |
| **Utilitários** | Tailwind Merge, clsx |
| **Linting** | ESLint 9 |

---

## 📋 Pré-requisitos e Instalação

### Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x (ou yarn/pnpm)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ernany_imoveis.git

# 2. Acesse o diretório
cd ernany_imoveis

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

---

## 📁 Estrutura de Pastas

```
src/
├── assets/              # Imagens, fontes e recursos estáticos
├── components/          # Componentes reutilizáveis
│   ├── Footer.jsx       # Rodapé
│   ├── Header.jsx       # Cabeçalho/Navegação
│   ├── Layout.jsx       # Layout principal
│   ├── Map.jsx          # Componente de mapa
│   ├── PropertyCard.jsx # Card de imóvel
│   ├── SearchBar.jsx    # Barra de busca
│   └── WhatsAppButton.jsx # Botão flutuante WhatsApp
├── hooks/               # Custom hooks
│   └── useAuth.js       # Hook de autenticação
├── pages/               # Páginas da aplicação
│   ├── Admin*.jsx       # Páginas administrativas
│   ├── Blog.jsx         # Blog
│   ├── CadastroCorretor.jsx # Cadastro de corretores
│   ├── Contact.jsx      # Contato
│   ├── Home.jsx         # Página inicial
│   ├── Imoveis.jsx      # Lista de imóveis
│   ├── Login.jsx        # Login
│   ├── PropertyDetail.jsx # Detalhes do imóvel
│   └── ...
├── services/            # Serviços/API
│   ├── authService.js   # Autenticação
│   └── imovelService.js # Imóveis
├── utils/               # Utilitários
│   └── cn.js            # Funções auxiliares (className)
├── App.jsx              # Componente principal
├── main.jsx             # Entry point
└── index.css           # Estilos globais
```

---

## ✨ Funcionalidades

- [x] Listagem de imóveis com filtros
- [x] Detalhes completos de cada imóvel
- [x] Busca e pesquisa de propriedades
- [x] Mapa interativo com localização
- [x] Sistema de autenticação
- [x] Dashboard administrativo
- [x] Gerenciamento de imóveis (CRUD)
- [x] Cadastro de corretores
- [x] Blog de notícias
- [x] Página de contato
- [x] Botão flutuante WhatsApp
- [x] Design responsivo
- [x] Animações e transições suaves

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera build de produção otimizado |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa ESLint para verificação de código |

---

## 🎨 Padrões de Código

- **ESLint 9**: Linting com regras React e React Refresh
- **Convenções**: Componentes funcionais com Hooks
- **Estilização**: Tailwind CSS com utility classes
- **Nomenclatura**: PascalCase para componentes, camelCase para funções

---

## 📄 Licença

MIT License - Copyright (c) 2026 Ernany Imóveis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">

Desenvolvido com ❤️ por [Ernany Imóveis]

</div>
