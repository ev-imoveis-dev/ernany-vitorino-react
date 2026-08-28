# Ernany Vitorino Imóveis — Front-end

Site institucional e catálogo de imóveis da EV Imóveis (Ernany Vitorino Imóveis), em produção desde junho de 2026.

**Site no ar:** https://ev-imoveis.online

## Funcionalidades

- Catálogo público de imóveis com filtros e página de detalhe
- Mapa de localização dos imóveis (Leaflet)
- Galeria de fotos em carrossel
- Área administrativa para cadastro e edição de imóveis e de corretores
- Autenticação com sessão em cookie HttpOnly, incluindo recuperação e troca de senha
- Formulário de contato com redirecionamento para WhatsApp

## Stack

React 19 · Vite · Tailwind CSS · React Router · Axios · Leaflet · Framer Motion · ESLint. Deploy na Vercel.

O back-end é uma API REST em Node.js, TypeScript, Express e PostgreSQL, mantida em repositório privado por ser código do cliente.

## Rodando localmente

```bash
npm install
npm run dev
```

Crie um arquivo `.env` na raiz apontando para a API:

```
VITE_API_URL=http://localhost:3333/api
```

Outros scripts: `npm run build`, `npm run preview` e `npm run lint`.

## Decisões técnicas

- **Sessão em cookie HttpOnly no lugar do localStorage.** O token deixou de ficar acessível ao JavaScript da página, reduzindo a exposição em caso de XSS. O cliente Axios envia o cookie automaticamente com `withCredentials`, e o back-end trabalha com CORS por allowlist de origem.
- **Auditoria de segurança antes do deploy.** As branches `audit/pre-deploy` e `audit/hardening-alto` concentram as correções feitas antes de o sistema ir ao ar.
- **Hooks customizados extraídos** para eliminar duplicação de guardas de autenticação e corrigir instabilidade de referência no `useAuth`.
- **Cabeçalhos de segurança** configurados no `index.html`.
- **Validação de senha** com critérios de complexidade no cadastro e na troca.

## Time

Desenvolvido em dupla por [Harley Carminati](https://github.com/carminatii) e [Bruno Calmon](https://github.com/bruno-calm0n), com trabalho em branches por feature e revisão por pull request — 46 PRs e 104 commits.
