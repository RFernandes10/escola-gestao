# 🏫 Escola Gestão - Sistema de Gestão Escolar com IA

Sistema completo de gestão escolar focado no gerenciamento de recursos humanos (RH), integrando inteligência artificial para análise de dados e geração de relatórios executivos.

## ✨ Funcionalidades

### 👥 Gestão de Funcionários (RH)
- Cadastro completo com upload de fotos
- Edição e inativação de funcionários
- Busca em tempo real e filtros por departamento
- Paginação e validação de dados (CPF, máscaras de entrada)

### 🔐 Autenticação e Autorização
- Sistema de login com JWT
- Dois níveis de acesso: **Diretor** (acesso total) e **Usuário** (visualização)
- Middleware de proteção de rotas
- Criptografia de senhas com bcrypt

### 🤖 Relatórios com Inteligência Artificial
- Resumos executivos automáticos da equipe
- Análise de dados com insights e recomendações para RH
- Relatórios completos gerados por IA (Google Gemini via Vertex AI)
- Estatísticas e distribuição por departamento

### 📊 Exportação de Dados
- Planilhas Excel formatadas (ExcelJS)
- Documentos PDF profissionais (PDFKit)

### 🎨 Interface Moderna
- Design system personalizado com tema escuro/claro
- Totalmente responsivo com Tailwind CSS
- Componentes reutilizáveis
- Feedback visual com notificações toast

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Framework web API REST
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional
- **Google Cloud Vertex AI** - Integração com Gemini para IA
- **JWT** - Autenticação
- **bcryptjs** - Criptografia
- **Multer** - Upload de arquivos
- **Jest** - Testes automatizados

### Frontend
- **Next.js 14** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **lucide-react** - Ícones
- **react-hot-toast** - Notificações

### Segurança
- Helmet (headers HTTP)
- CORS configurado
- Rate limiting
- Validação de entrada

## 📁 Estrutura do Projeto

```
escola-gestao/
├── backend/              # API REST (Node.js/Express)
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── services/     # Lógica de negócio
│   │   ├── routes/       # Rotas da API
│   │   ├── middlewares/  # Middlewares (auth, role)
│   │   ├── utils/        # Utilitários
│   │   └── validators/   # Validações
│   ├── prisma/           # Schema e migrações
│   └── tests/            # Testes automatizados
│
└── frontend/             # Interface (Next.js/React)
    ├── app/              # App Router (páginas)
    ├── components/        # Componentes React
    ├── contexts/         # Context API (Auth)
    ├── hooks/            # Custom hooks
    ├── lib/              # Configuração da API
    └── types/            # Tipos TypeScript
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL
- Conta no Google Cloud (para Vertex AI)

### Backend
```bash
cd backend
npm install
# Configure o arquivo .env com as variáveis necessárias
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Configure o arquivo .env.local
npm run dev
```

### Variáveis de Ambiente

**Backend (.env):**
```
DATABASE_URL="postgresql://user:password@localhost:5432/escola_gestao"
JWT_SECRET="seu-jwt-secret"
GEMINI_API_KEY="sua-api-key-google"
GOOGLE_CLOUD_PROJECT="seu-projeto-id"
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 🧪 Testes

```bash
cd backend
npm test
```

## 📌 Diferenciais

- Arquitetura limpa com separação em camadas
- Integração nativa com Google Cloud AI
- Testes automatizados com Jest
- Design system próprio
- Suporte a temas (dark/light mode)
- Deploy-ready

## 📝 Licença

Este projeto é de uso acadêmico.

---

Desenvolvido por [RFernandes10](https://github.com/RFernandes10)
