# ⚡ RitiFull

Site dark premium com Email Temporário, Conversor, IA e Diretório de Sites.

## 🔗 URL Structure (GitHub Pages)

```
Ritizin.github.io/RitiFull/          → Login
Ritizin.github.io/RitiFull/home/     → Dashboard
Ritizin.github.io/RitiFull/email/    → Email Temporário
Ritizin.github.io/RitiFull/converter/→ Conversor
Ritizin.github.io/RitiFull/ia/       → IA
Ritizin.github.io/RitiFull/sites/    → Sites & Apps
Ritizin.github.io/RitiFull/admin/    → Admin Panel
```

## 🔐 Login Admin

| Campo    | Valor    |
|----------|----------|
| Usuário  | Ritizin  |
| Senha    | 46616712 |

## ⚡ Setup Supabase

1. Acesse https://supabase.com e faça login
2. Abra seu projeto → SQL Editor
3. Cole o conteúdo de **setup.sql** e execute
4. Pronto! Os sites serão carregados automaticamente.

## 📦 Funcionalidades

### 📧 Email Temporário
- API: mail.tm (gratuita, sem chave)
- Gera email descartável real
- Inbox com auto-refresh (30s)
- Histórico de até 20 emails
- Botão Gerar, Atualizar, Copiar
- Delete individual e Limpar tudo no histórico

### 🔄 Conversor
- **MP4 → MP3**: FFmpeg.wasm (carregado via CDN)
  - Fallback: extrai áudio como WAV via Web Audio API
- **JPG → PNG**: Canvas API
- **WebP → JPG**: Canvas API  
- **IMG → ICO**: Gera arquivo .ico real com múltiplos tamanhos

### 🤖 IA Offline
- Base de conhecimento em JavaScript (sem API externa)
- Tópicos: Ciência, Tecnologia, História, Geografia, Esportes, Cultura, Saúde, Matemática
- Calcula expressões matemáticas automaticamente
- Efeito de digitação nas respostas

### 🌐 Sites & Apps
- Carregado do Supabase em tempo real
- Abas: Todos, Filmes & Séries, Otaku, IA
- Busca por nome/descrição/URL
- Fallback com dados de exemplo se Supabase não configurado

### ⚙️ Painel Admin
- Protegido por autenticação
- CRUD completo de sites (adicionar, editar, deletar)
- Filtro por categoria e busca
- Stats em tempo real via Supabase Realtime
- Guia de setup do banco embutido

## 🚀 Deploy no GitHub Pages

1. Crie repositório `RitiFull` no GitHub (usuário: Ritizin)
2. Faça upload de todos os arquivos desta pasta
3. Em Settings → Pages → Source: `main` branch, pasta `/`
4. Acesse: `https://Ritizin.github.io/RitiFull/`

## 🎨 Design

- Tema: Dark premium (fundo #0a0a0f)
- Cores: Roxo (#7c3aed) + Cyan (#06b6d4)
- Fonte: Inter + Outfit (Google Fonts)
- Efeitos: Glassmorphism, Neon glow, Micro-animações

## 📁 Estrutura

```
RitiFull/
├── index.html          ← Login
├── setup.sql           ← Setup Supabase
├── README.md
├── assets/
│   └── css/
│       └── global.css  ← Design System
├── home/index.html
├── email/index.html
├── converter/index.html
├── ia/index.html
├── sites/index.html
└── admin/index.html
```
