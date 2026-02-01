# 📚 Documentação de Rotas da API - Voluntree

**Base URL (Dev):** `http://localhost:8081/api`  
**Base URL (Prod):** `http://localhost:8080/api`

---

## 🔐 Autenticação

Todas as requisições (exceto as públicas) requerem autenticação via **sessão/cookie**. Configure `withCredentials: true` no frontend.

### Rotas Públicas (Anonymous)

#### **POST** `/api/auth/login`
Realiza o login do usuário.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuário autenticado com sucesso!"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "E-mail ou senha inválidos!"
}
```

---

#### **POST** `/api/auth/signup/volunteer`
Cadastra um novo voluntário.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "cpf": "12345678900",
  "phone": "11987654321",
  "birthdate": "1990-05-15"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "VOLUNTEER"
}
```

---

#### **POST** `/api/auth/signup/organization`
Cadastra uma nova organização.

**Request Body:**
```json
{
  "name": "ONG Esperança",
  "email": "contato@ong.com",
  "password": "senha123",
  "cnpj": "12345678000190",
  "phone": "1133334444",
  "address": "Rua das Flores, 123"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "ONG Esperança",
  "email": "contato@ong.com",
  "role": "ORGANIZATION"
}
```

---

### Rotas Autenticadas

#### **GET** `/api/auth`
Verifica se o usuário está autenticado.

**Response (200 OK):**
```json
{
  "status": true,
  "userId": 1,
  "role": "VOLUNTEER"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": false
}
```

---

#### **POST** `/api/auth/logout`
Realiza logout do usuário.

**Response (200 OK):**
```json
{
  "message": "Logout realizado com sucesso!"
}
```

---

#### **GET** `/api/auth/csrf`
Obtém o token CSRF (se necessário).

**Response (200 OK):**
```json
{
  "token": "abc123...",
  "headerName": "X-XSRF-TOKEN"
}
```

---

## 👤 Usuário

### **GET** `/api/user/me`
Obtém o perfil do usuário autenticado.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "VOLUNTEER",
  "cpf": "12345678900",
  "phone": "11987654321",
  "birthdate": "1990-05-15"
}
```

---

### **PUT** `/api/user/me`
Atualiza os dados do usuário.

**Request Body:**
```json
{
  "name": "João Silva Santos",
  "phone": "11999998888",
  "address": "Rua Nova, 456"
}
```

**Response (204 No Content)**

---

### **PATCH** `/api/user/me/password`
Atualiza a senha do usuário.

**Request Body:**
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

**Response (204 No Content)**

---

## 🎯 Atividades

### **GET** `/api/activity`
Lista todas as atividades (paginado).

**Query Params:**
- `page` (int): Número da página (default: 0)
- `size` (int): Tamanho da página (default: 20)
- `sort` (string): Campo de ordenação (default: activityDate)

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Distribuição de Alimentos",
      "description": "Ajudar na distribuição de cestas básicas",
      "activityDate": "2026-02-15T09:00:00",
      "location": "Centro Comunitário",
      "maxVolunteers": 20,
      "currentVolunteers": 5,
      "status": "ACTIVE",
      "organizationName": "ONG Esperança"
    }
  ],
  "pageable": { ... },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "first": true
}
```

---

### **GET** `/api/activity/upcoming`
Lista atividades futuras (paginado).

**Query Params:** Mesmos de `/api/activity`

**Response:** Mesma estrutura de `/api/activity`

---

### **GET** `/api/activity/{id}`
Obtém detalhes de uma atividade específica.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Distribuição de Alimentos",
  "description": "Ajudar na distribuição de cestas básicas",
  "activityDate": "2026-02-15T09:00:00",
  "location": "Centro Comunitário",
  "maxVolunteers": 20,
  "currentVolunteers": 5,
  "status": "ACTIVE",
  "organizationId": 2,
  "organizationName": "ONG Esperança",
  "createdAt": "2026-01-15T10:00:00"
}
```

---

### **GET** `/api/activity/organization/{organizationId}`
Lista atividades de uma organização específica (paginado).

**Response:** Mesma estrutura de `/api/activity`

---

### **GET** `/api/activity/my-activities` 🔒 ORGANIZATION
Lista atividades da organização autenticada (paginado).

**Response:** Mesma estrutura de `/api/activity`

---

### **POST** `/api/activity` 🔒 ORGANIZATION
Cria uma nova atividade.

**Request Body:**
```json
{
  "title": "Nova Atividade",
  "description": "Descrição da atividade",
  "activityDate": "2026-03-01T10:00:00",
  "location": "Local da atividade",
  "maxVolunteers": 15
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Nova Atividade",
  "description": "Descrição da atividade",
  "activityDate": "2026-03-01T10:00:00",
  "location": "Local da atividade",
  "maxVolunteers": 15,
  "currentVolunteers": 0,
  "status": "ACTIVE",
  "organizationId": 2,
  "organizationName": "ONG Esperança"
}
```

---

### **PUT** `/api/activity/{id}` 🔒 ORGANIZATION
Atualiza uma atividade.

**Request Body:**
```json
{
  "title": "Atividade Atualizada",
  "description": "Nova descrição",
  "activityDate": "2026-03-02T10:00:00",
  "location": "Novo local",
  "maxVolunteers": 20
}
```

**Response (200 OK):** Retorna os dados atualizados

---

### **PATCH** `/api/activity/{id}/cancel` 🔒 ORGANIZATION
Cancela uma atividade.

**Response (204 No Content)**

---

### **DELETE** `/api/activity/{id}` 🔒 ORGANIZATION
Remove uma atividade.

**Response (204 No Content)**

---

## 📝 Inscrições

### **POST** `/api/registration/activity/{activityId}` 🔒 VOLUNTEER
Inscreve o voluntário em uma atividade.

**Response (200 OK):**
```json
"Inscrição realizada com sucesso!"
```

---

### **DELETE** `/api/registration/activity/{activityId}` 🔒 VOLUNTEER
Cancela a inscrição em uma atividade.

**Response (200 OK):**
```json
"Inscrição cancelada."
```

---

### **GET** `/api/registration/my` 🔒 VOLUNTEER
Lista as inscrições do voluntário.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "activityId": 5,
    "activityTitle": "Distribuição de Alimentos",
    "activityDate": "2026-02-15T09:00:00",
    "status": "CONFIRMED",
    "registeredAt": "2026-02-01T14:30:00"
  }
]
```

---

## 📊 Auditoria

### **GET** `/api/audit/history`
Lista o histórico de auditoria do usuário autenticado (paginado).

**Query Params:**
- `page` (int): Número da página (default: 0)
- `size` (int): Tamanho da página (default: 10)

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "action": "LOGIN",
      "timestamp": "2026-02-01T10:00:00",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "totalElements": 50,
  "totalPages": 5
}
```

---

## 🔒 Níveis de Autorização

| Ícone | Significado |
|-------|-------------|
| 🌐 Pública | Não requer autenticação |
| 🔓 Autenticada | Requer login (qualquer role) |
| 🔒 VOLUNTEER | Apenas voluntários |
| 🔒 ORGANIZATION | Apenas organizações |

---

## ⚙️ Configuração no Frontend (Angular)

```typescript
// environment.development.ts
export const environment = {
  apiUrl: 'http://localhost:8081/api'
};

// Interceptor global
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true  // ← ESSENCIAL para cookies
  });
  return next(authReq);
};
```

---

## 🐛 Códigos de Erro Comuns

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 204 | Sucesso sem conteúdo |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Recurso não encontrado |
| 405 | Método não permitido |
| 500 | Erro interno do servidor |

---

**Última atualização:** 1 de fevereiro de 2026
