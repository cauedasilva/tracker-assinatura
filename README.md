# Tracker Assinatura – API RESTful

Este projeto uma API RESTful desenvolvida em Node.js com Express e MongoDB, cujo objetivo é o controle de assinaturas recorrentes (streaming, SaaS e serviços em geral).

A API permite gerenciar serviços recorrentes, calcular automaticamente datas de renovação, controlar o status das assinaturas e utilizar autenticação JWT para proteger as rotas.

O projeto possui um front-end básico em HTML, CSS e JavaScript, incluído apenas para demonstração do funcionamento do CRUD. O foco principal do projeto é o backend (API).

## Funcionalidades

Cadastro e autenticação de usuários

Criação, edição, listagem e exclusão de assinaturas

Cálculo automático da próxima data de renovação

Controle de status da assinatura:

active

canceled

expired

Autenticação baseada em JWT

Proteções básicas contra abuso (rate limiting e bot protection)

## Tecnologias Utilizadas
### Backend

Node.js

Express.js — Framework para criação de rotas

MongoDB — Banco de dados NoSQL

Mongoose — ODM para modelagem de dados

### Autenticação e Segurança

JWT (jsonwebtoken) — Autenticação via token

bcryptjs — Criptografia de senhas

cookie-parser — Manipulação de cookies

Arcjet Middleware — Proteção contra bots e controle de requisições

### Mensageria e Processamento Assíncrono

QStash (Upstash) — Agendamento e execução de tarefas assíncronas, utilizado para fluxos automatizados e eventos relacionados às assinaturas

### Front-end

HTML

CSS

JavaScript puro

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

POST / — Criar nova assinatura

GET / — Listar todas as assinaturas

GET /:id — Buscar assinatura por ID

GET /user/:id — Listar assinaturas de um usuário

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

user (referência ao usuário criador da assinatura)

## Exemplo de Requisição
Criar Assinatura

POST /api/v1/subscriptions

Headers

Authorization: Bearer <TOKEN>
Content-Type: application/json


Body

{
  "name": "HBO",
  "price": 20.99,
  "currency": "BRL",
  "frequency": "monthly",
  "category": "tech",
  "paymentMethod": "Debit Card",
  "startDate": "2025-01-01T00:00:00.000Z"
}


Resposta

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
