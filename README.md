# Tracker Assinatura – API
O Tracker Assinatura é uma API RESTful desenvolvida com foco em gerenciamento de assinaturas, permitindo criar, listar, atualizar e excluir serviços assinados por um usuário.
O projeto segue a arquitetura MEAN Stack, utilizando MongoDB, Express.js e Node.js — sem frontend incluso no repositório.

# Tecnologias Utilizadas
## Backend

Node.js — Ambiente de execução JavaScript.
Express.js — Framework para criação das rotas e estrutura do servidor.
MongoDB + Mongoose — Banco NoSQL e ODM para modelagem dos dados.
Autenticação & Segurança
JWT (jsonwebtoken) — Autenticação baseada em token.
bcryptjs — Hashing de senhas.
cookie-parser — Manipulação de cookies.
Arcjet Middleware — Proteção anti-bot e segurança adicional nas requisições.

## Utilidades
dotenv — Gerenciamento de variáveis de ambiente.
Nodemon (ambiente de desenvolvimento) — Auto-reload.

## Estrutura da API
A API fornece endpoints organizados em módulos:

### /api/v1/auth
Registro de usuário
Login
Geração e validação de JWT

 ### /api/v1/users
Detalhes do usuário
CRUD básico (dependendo da implementação)

### /api/v1/subscriptions
Criação de assinaturas
Listagem por usuário
Atualização e cancelamento
Cálculo automático de próxima renovação
Status dinâmico (ativa, cancelada ou expirada)

### Banco de Dados
A API utiliza MongoDB com modelos organizados para:
User e Subscription
Cada assinatura armazena:
Nome, Preço, Frequência (mensal, semanal, etc.), Método de pagamento, Status, Datas de início e renovação, Referência ao usuário proprietário

Exemplo de Requisição para criar assinatura:

POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

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

{
  "success": true,
  "data": {
    "_id": "693a0695bae7344ee885c171",
    "name": "HBO",
    "status": "expired",
    "renewalDate": "2025-01-31T00:00:00.000Z",
    ...
  }
}

### Objetivo do Projeto
O propósito dessa API é fornecer uma base sólida para um sistema completo de controle de assinaturas, podendo futuramente servir como backend para:
Aplicações web
Aplicativos mobile
Dashboards de consumo financeiro
