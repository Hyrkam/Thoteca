# Thoteca — Biblioteca Digital (local)

Projeto simples para apresentação: frontend está em `index.html`, `style.css`, `script.js`. Backend em `backend/` com Express + SQLite.

Rápido guia para rodar localmente (Windows PowerShell):

1. Instale dependências do backend:

```powershell
cd "C:\Users\Novo\Desktop\Trabalho\backend"
npm install
```

2. Inicie o servidor (por padrão porta 3000):

```powershell
node src/index.js
```

3. Abra o frontend no navegador:

http://localhost:3000/index.html

Endpoints principais:
- POST /api/auth/register {name,email,password} -> {user,token}
- POST /api/auth/login {email,password} -> {user,token}
- GET /api/books -> lista de livros
- GET /api/books/:id -> livro (incrementa views)
- POST /api/books (Bearer token) -> cria livro
- GET /api/books/ranking/top -> top por visualizações

Observações:
- O banco SQLite é criado em `backend/thoteca.db` automaticamente.
- Para produção defina `JWT_SECRET` no ambiente.
