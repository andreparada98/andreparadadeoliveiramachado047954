# Desafio SEPLAG 2026 - Sistema de Gestão Musical

Este projeto é uma solução para o Desafio SEPLAG 2026, consistindo em uma plataforma de gestão de álbuns e artistas.

## 📝 Detalhes da Inscrição
- **Candidato:** André Parada de Oliveira Machado
- **Projeto:** Desafio SEPLAG Musical 2026
- **Tecnologias Principais:** Java 21, Spring Boot, PostgreSQL, MinIO.

---

## 🏗️ Arquitetura do Projeto

O projeto utiliza uma arquitetura de **monorepo**, dividida da seguinte forma:

- **`/backend`**: API REST desenvolvida com Spring Boot 3.x/4.x.
- **`/frontend`**: (Em desenvolvimento) Interface do usuário.

### Tecnologias do Backend:
- **Linguagem:** Java 21
- **Framework:** Spring Boot 4.0.2
- **Banco de Dados:** PostgreSQL (Persistência de dados relacionais)
- **Object Storage:** MinIO (Armazenamento de arquivos de imagem/capas)
- **Segurança:** Spring Security com autenticação JWT (JSON Web Token)
- **Documentação:** Swagger/OpenAPI (SpringDoc)
- **Migrações:** Flyway para versionamento do banco de dados

---

## 🚀 Como Rodar o Backend

### Pré-requisitos
- Docker e Docker Compose instalados.
- Java 21 instalado (opcional se usar apenas Docker para a infra).
- Maven (ou usar o `mvnw` incluso).

### Passo 1: Subir a Infraestrutura (Banco e Storage)
O projeto utiliza Docker Compose para gerenciar o banco de dados e o MinIO.

```bash
docker-compose up -d
```

Isso iniciará:
- **PostgreSQL:** porta `5656`
- **MinIO:** porta `9000` (API) e `9001` (Console)

### Passo 2: Executar a Aplicação
Com a infraestrutura rodando, execute o comando abaixo na pasta `backend`:

```bash
./mvnw spring-boot:run
```

A aplicação estará disponível em: `http://localhost:3000`

### Passo 3: Documentação da API
Após rodar a aplicação, você pode acessar a documentação interativa (Swagger) em:
`http://localhost:3000/api`

---

## 🛠️ Configurações Adicionais
- O arquivo de configuração principal está em `backend/src/main/resources/application.properties`.
- As migrações do banco de dados são executadas automaticamente pelo Flyway ao iniciar o app.

