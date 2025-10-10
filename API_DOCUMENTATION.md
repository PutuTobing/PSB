# API Documentation - Database Login Application

## 🔗 Base URL
```
Development: http://localhost:3000
Production: [TO BE CONFIGURED]
```

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:
```http
Authorization: Bearer <jwt_token>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com",
        "role": "Administrator"
    }
}
```

**Error Response (401 Unauthorized):**
```json
{
    "error": "Invalid credentials"
}
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Administrator",
    "phone": "08123456789",
    "address": "Jl. Example No. 123"
}
```

## 👥 Users Management

### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Administrator",
        "phone": "08123456789",
        "address": "Jl. Example No. 123",
        "created_at": "2025-01-01T00:00:00.000Z"
    }
]
```

### Create User
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "User",
    "phone": "08987654321",
    "address": "Jl. Sample No. 456"
}
```

**Response (201 Created):**
```json
{
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "User",
    "phone": "08987654321",
    "address": "Jl. Sample No. 456"
}
```

### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "Administrator",
    "phone": "08111222333",
    "address": "Jl. Updated No. 789"
}
```

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "message": "User deleted successfully"
}
```

### Reset User Password
```http
POST /api/users/:id/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
    "newPassword": "newpassword123"
}
```

## 🏢 Agents Management

### Get All Agents
```http
GET /api/agents
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Agent One",
        "phone": "08123456789",
        "email": "agent1@example.com",
        "address": "Jl. Agent No. 123",
        "created_at": "2025-01-01T00:00:00.000Z"
    }
]
```

### Create Agent
```http
POST /api/agents
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Agent Two",
    "phone": "08987654321",
    "email": "agent2@example.com",
    "address": "Jl. Agent No. 456"
}
```

### Update Agent
```http
PUT /api/agents/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Agent",
    "phone": "08111222333",
    "email": "updated@example.com",
    "address": "Jl. Updated Agent No. 789"
}
```

### Delete Agent
```http
DELETE /api/agents/:id
Authorization: Bearer <token>
```

## 🏘️ Villages Management

### Get All Villages
```http
GET /api/villages
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Desa Satu",
        "kecamatan": "Kecamatan Satu",
        "kabupaten": "Kabupaten Satu",
        "created_at": "2025-01-01T00:00:00.000Z"
    }
]
```

### Create Village
```http
POST /api/villages
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Desa Baru",
    "kecamatan": "Kecamatan Baru",
    "kabupaten": "Kabupaten Baru"
}
```

### Update Village
```http
PUT /api/villages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Desa Updated",
    "kecamatan": "Kecamatan Updated",
    "kabupaten": "Kabupaten Updated"
}
```

### Delete Village
```http
DELETE /api/villages/:id
Authorization: Bearer <token>
```

## 📋 Pemasangan (Installations) Management

### Get All Pemasangan
```http
GET /api/pemasangan
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "nama_pelanggan": "Customer One",
        "alamat": "Jl. Customer No. 123",
        "desa_id": 1,
        "desa_name": "Desa Satu",
        "agent_id": 1,
        "agent_name": "Agent One",
        "paket": "Paket Premium",
        "harga": 500000.00,
        "komisi": 50000.00,
        "status": "Pending",
        "tanggal_pemasangan": "2025-01-15",
        "created_at": "2025-01-01T00:00:00.000Z"
    }
]
```

### Create Pemasangan
```http
POST /api/pemasangan
Authorization: Bearer <token>
Content-Type: application/json

{
    "nama_pelanggan": "New Customer",
    "alamat": "Jl. New Customer No. 456",
    "desa_id": 1,
    "agent_id": 1,
    "paket": "Paket Standard",
    "harga": 300000.00,
    "komisi": 30000.00,
    "status": "Pending",
    "tanggal_pemasangan": "2025-01-20"
}
```

### Update Pemasangan
```http
PUT /api/pemasangan/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "nama_pelanggan": "Updated Customer",
    "alamat": "Jl. Updated No. 789",
    "desa_id": 2,
    "agent_id": 2,
    "paket": "Paket Premium",
    "harga": 500000.00,
    "komisi": 50000.00,
    "status": "Confirmed",
    "tanggal_pemasangan": "2025-01-25"
}
```

### Delete Pemasangan
```http
DELETE /api/pemasangan/:id
Authorization: Bearer <token>
```

## 📊 Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## 🔒 Security Headers

All API responses include security headers:
```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 📝 Error Response Format

All error responses follow this format:
```json
{
    "error": "Error message describing what went wrong",
    "code": "ERROR_CODE",
    "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Common Error Codes

| Error Code | Description | HTTP Status |
|-----------|-------------|-------------|
| `INVALID_CREDENTIALS` | Login failed | 401 |
| `TOKEN_EXPIRED` | JWT token expired | 401 |
| `TOKEN_INVALID` | JWT token malformed | 401 |
| `ACCESS_DENIED` | Insufficient permissions | 403 |
| `RESOURCE_NOT_FOUND` | Requested resource not found | 404 |
| `VALIDATION_ERROR` | Request data validation failed | 400 |
| `DUPLICATE_EMAIL` | Email already exists | 400 |
| `SERVER_ERROR` | Internal server error | 500 |

## 🧪 Testing with curl

### Login Test
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Get Users Test
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create User Test
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "User"
  }'
```

## 🔄 Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:

```javascript
// Example rate limiting configuration
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

## 📈 Monitoring & Logging

### Request Logging
All requests are logged with:
- Timestamp
- HTTP method
- URL path  
- Response status
- Response time

### Error Logging
Errors are logged with:
- Error message
- Stack trace
- Request context
- User information (if authenticated)

---

**API Version**: 2.0.0
**Last Updated**: October 10, 2025