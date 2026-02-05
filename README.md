# Desafio SEPLAG 2026 - Sistema de Gestão Musical

Este projeto é uma solução completa (Full Stack) para o Desafio SEPLAG 2026, consistindo em uma plataforma para o gerenciamento de artistas e seus respectivos álbuns.

## 📝 Detalhes da Inscrição
- **Candidato:** André Parada de Oliveira Machado
- **Projeto:** Desafio SEPLAG Musical 2026
- **Vaga:** Implementação Full Stack Sênior (Java + Angular)

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura moderna e escalável, utilizando o padrão de monorepo:

- **`/backend`**: API REST robusta desenvolvida com **Java 21** e **Spring Boot 3.4**.
  - **Persistência:** PostgreSQL para dados relacionais.
  - **Storage:** MinIO (compatível com S3) para armazenamento de capas de álbuns.
  - **Migrações:** Flyway para controle de versão do esquema do banco de dados.
  - **Documentação:** OpenAPI 3.0 (Swagger) para exploração de endpoints.
- **`/frontend`**: Aplicação SPA desenvolvida com **Angular 19**.
  - **Estado:** Uso intensivo de **Angular Signals** e **RxJS** para uma interface reativa e performática.
  - **Estilização:** SCSS modularizado com foco em responsividade.
  - **Componentização:** Biblioteca de componentes customizados (`XButton`, `XInput`, `XPagination`, etc.).

---

## ✅ Checklist de Implementação (Anexo II-C)

### A. Arquitetura e Integração
- [x] **Estrutura completa:** Front + Back integrados via docker-compose.
- [x] **Comunicação entre camadas:** APIs consumidas corretamente com tratamento de erros.
- [x] **Documentação:** Instruções claras de execução e decisões técnicas registradas.

### B. Back End
- [x] **CRUD, JWT e MinIO:** Implementação de Artistas/Álbuns, Segurança JWT e configuração base MinIO.
- [x] **Paginação e Filtros:** Consultas ordenadas e paginadas no banco de dados.
- [x] **Swagger e Migrations:** Documentação interativa e versionamento de banco via Flyway.
- [x] **Versionamento:** Endpoints versionados (ex: `/v1/artist`).
- [ ] **Rate Limit e Health Checks:** (Em planejamento).
- [ ] **WebSocket:** Notificações em tempo real (Pendente).

### C. Front End
- [x] **Consumo de API:** Integração total com o backend para listagem, busca e formulários.
- [x] **Interface e Usabilidade:** Layout responsivo, busca reativa e navegação fluida.
- [x] **Componentização e Estado:** Uso de Signals para gerenciamento de estado e componentes reutilizáveis.
- [x] **Paginação:** Componente customizado com controle de itens por página.
- [x] **Autenticação:** Fluxo de login com persistência de token e logout automático em caso de expiração.

---

## 🚀 Como Executar o Projeto

O projeto está totalmente containerizado, facilitando a execução em qualquer ambiente.

### 1. Pré-requisitos
- Docker e Docker Compose instalados.

### 2. Execução via Docker Compose
Na raiz do projeto, execute:

```bash
docker-compose up -d --build
```

Isso iniciará:
- **API (Spring Boot):** `http://localhost:8080` (Documentação em `/api`)
- **Front-end (Angular):** `http://localhost:4200`
- **PostgreSQL:** porta `5432`
- **MinIO:** porta `9000` (API) e `9001` (Console)

### 3. Execução Manual (Desenvolvimento)

#### Backend:
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

---

## 🛠️ Decisões Técnicas e Justificativas

- **Angular Signals:** Escolhido pela simplicidade e performance superior em comparação ao Zone.js tradicional, permitindo atualizações de grão fino no DOM.
- **Spring Boot 3.x:** Utilização das versões mais recentes para aproveitar melhorias de performance e segurança (como suporte nativo a Java 21).
- **Flyway:** Adotado para garantir que todos os membros da equipe (ou avaliadores) tenham o banco de dados exatamente na mesma versão de forma automatizada.
- **Componentização (X-Components):** A criação de componentes prefixados com `X` (ex: `XPagination`) visa criar um "Design System" interno, facilitando a manutenção e garantindo consistência visual em todo o app.

---

## 👨‍💻 Candidato
**André Parada de Oliveira Machado**
*Desenvolvedor Full Stack Sênior*
