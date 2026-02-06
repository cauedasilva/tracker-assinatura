# Tracker Assinatura – API RESTful + Front-end Angular

API RESTful desenvolvida em Node.js com Express e MongoDB, juntamente com um front-end em Angular, cujo objetivo é o controle de assinaturas recorrentes.

A aplicação permite gerenciar serviços recorrentes, calcular automaticamente datas de renovação, controlar o status das assinaturas e utilizar autenticação JWT para proteger as rotas.

O foco principal do projeto é o backend, porém o front-end em Angular foi desenvolvido para consumo real da API, autenticação de usuários e visualização das assinaturas.

## Funcionalidades

Cadastro e autenticação de usuários

Login e logout com JWT

Criação, edição, listagem e exclusão de assinaturas

Assinaturas associadas exclusivamente ao usuário autenticado

Cálculo automático da próxima data de renovação

Controle de status da assinatura:

active

canceled

expired

Proteção de rotas com middleware de autenticação

Proteções básicas contra abuso (rate limiting e bot protection)

Processamento assíncrono de eventos relacionados às assinaturas

## Tecnologias Utilizadas
### Backend

Node.js

Express.js — Framework para criação de rotas

MongoDB — Banco de dados NoSQL

Mongoose — ODM para modelagem de dados

### Autenticação e Segurança

JWT (jsonwebtoken) — Autenticação baseada em token

bcryptjs — Criptografia de senhas

cookie-parser — Manipulação de cookies

Arcjet Middleware — Proteção contra bots e controle de requisições

### Mensageria e Processamento Assíncrono

QStash (Upstash) — Agendamento e execução de tarefas assíncronas

### Front-end

Angular

TypeScript

### Angular Components

HttpClient + Interceptors

Signals para gerenciamento de estado

JWT via Authorization Header

## Estrutura da API
### Autenticação

Base: /api/v1/auth

POST /sign-up — Registro de usuário

POST /sign-in — Login

POST /sign-out — Logout

### Usuários

Base: /api/v1/users

GET / — Listar usuários

GET /:id — Buscar usuário por ID

POST / — Criar usuário

PUT /:id — Atualizar usuário

DELETE /:id — Remover usuário

### Assinaturas

Base: /api/v1/subscriptions

Todas as rotas protegidas exigem autenticação JWT.

POST / — Criar nova assinatura

GET /me — Listar assinaturas do usuário autenticado

GET /:id — Buscar assinatura por ID

PUT /:id — Atualizar assinatura

PUT /:id/cancel — Cancelar assinatura

DELETE /:id — Excluir assinatura

GET /upcoming-renewals — Listar próximas renovações

## Modelos do Banco de Dados
### User

name

email

password (hash)

timestamps

### Subscription

name

price

currency

frequency (daily, weekly, monthly, yearly)

category

paymentMethod

status

startDate

renewalDate

user (referência ao usuário autenticado)

## Exemplo de Requisição
Criar Assinatura

POST /api/v1/subscriptions

Headers

Authorization: Bearer <TOKEN>
Content-Type: application/json


Body
```json
{
  "name": "HBO",
  "price": 20.99,
  "currency": "BRL",
  "frequency": "monthly",
  "category": "tech",
  "paymentMethod": "Debit Card",
  "startDate": "2025-01-01T00:00:00.000Z"
}
```

Resposta

```json
{
  "success": true,
  "data": {
    "_id": "693a0695bae7344ee885c171",
    "name": "HBO",
    "status": "expired",
    "renewalDate": "2025-01-31T00:00:00.000Z",
    "price": 20.99,
    "currency": "BRL",
    "frequency": "monthly"
  }
}
```
