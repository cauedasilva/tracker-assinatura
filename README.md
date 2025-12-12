# Tracker Assinatura – API RESTful

O Tracker Assinatura é uma API RESTful voltada para o gerenciamento de assinaturas.
Permite registrar usuários, autenticar com JWT e realizar operações de CRUD em assinaturas como Netflix, HBO, Spotify, etc.

# Tecnologias Utilizadas
### Backend

Node.js — Ambiente de execução JavaScript

Express.js — Framework para criação das rotas e estrutura do servidor

MongoDB + Mongoose — Banco NoSQL + ODM para modelagem dos dados

Autenticação & Segurança

JWT (jsonwebtoken) — Autenticação baseada em token

bcryptjs — Criptografia de senhas

cookie-parser — Manipulação de cookies

Arcjet Middleware — Proteção anti-bot / rate limiting

### Utilidades

dotenv — Variáveis de ambiente

Nodemon (dev) — Auto reload em desenvolvimento

## Estrutura da API

A API segue uma estrutura modular com rotas organizadas em:

### /api/v1/auth

Registro de usuário

Login

Geração e validação de JWT

### /api/v1/users

Detalhes do usuário

CRUD básico

### /api/v1/subscriptions

Criar nova assinatura

Listar todas as assinaturas do usuário

Atualizar assinatura

Cancelar assinatura

Cálculo automático da próxima renovação

Status dinâmico: active, canceled, expired

### Banco de Dados (MongoDB)

A API utiliza dois modelos principais:

#### User

nome

email

password (hash)

timestamps

#### Subscription

name

price

currency

frequency (daily, weekly, monthly, yearly)

category

paymentMethod

status

startDate

renewalDate

user (referência para o dono da assinatura)

### Exemplo de Requisição (Criar Assinatura)
POST /api/v1/subscriptions

Headers:

json
Authorization: Bearer <token>
Content-Type: application/json

Body:

json
{
  "name": "HBO",
  "price": 20.99,
  "currency": "BRL",
  "frequency": "monthly",
  "category": "tech",
  "paymentMethod": "Debit Card",
  "startDate": "2025-01-01T00:00:00.000Z"
}

Resposta:

json
{
  "success": true,
  "data": {
    "_id": "693a0695bae7344ee885c171",
    "name": "HBO",
    "status": "expired",
    "renewalDate": "2025-01-31T00:00:00.000Z",
    "price": 20.99,
    "currency": "USD",
    "frequency": "monthly"
  }
}

### Objetivo do Projeto

O propósito dessa API é fornecer uma base sólida para um sistema de controle de assinaturas, podendo servir como backend para:

Aplicações Web

Aplicativos Mobile

Dashboards financeiros

Sistemas de controle de gastos
