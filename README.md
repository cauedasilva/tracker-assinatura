# Tracker Assinatura – API RESTful

Este projeto é uma API RESTful em Node.js com Express e MongoDB, tem como função principal o controle de assinaturas.
A API gerencia serviços recorrentes, calcula automaticamente datas de renovação, controla status (ativo, cancelado ou expirado) e utiliza autenticação JWT para segurança.
Construí somente o backend.

# Tecnologias Utilizadas
### Backend

Node.js

Express.js — Framework para criação das rotas

MongoDB + Mongoose — Banco NoSQL + ODM para modelagem

### Autenticação & Segurança

JWT (jsonwebtoken) — Autenticação em token

bcryptjs — Criptografia de senhas

cookie-parser — Manipulação de cookies

Arcjet Middleware — Proteção anti-bot e rate limiting

## Estrutura da API

A API segue uma estrutura com rotas organizadas em:

### /api/v1/auth

Registro de usuário

Login

Geração e validação do JWT

### /api/v1/users

Detalhes do usuário

CRUD básico

### /api/v1/subscriptions

Criar nova assinatura

Listar todas as assinaturas do usuário

Atualizar assinatura

Cancelar assinatura

Cálculo automático da próxima renovação

Status: active, canceled, expired

### Banco de Dados (MongoDB)

A API utiliza dois modelos:

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

user (referência para quem iniciou aa assinatura)

### Exemplo de Requisição (Criar Assinatura)

POST /api/v1/subscriptions

Headers:

Authorization: Bearer <token>
Content-Type: application/json

Body:
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
Resposta:
```json
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
```
