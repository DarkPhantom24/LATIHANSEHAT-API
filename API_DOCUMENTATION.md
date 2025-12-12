# LATIHANSEHAT API Documentation

## 📋 Overview

LATIHANSEHAT adalah aplikasi manajemen latihan kesehatan dengan arsitektur hybrid REST + GraphQL. API ini menyediakan fitur lengkap untuk tracking latihan, kalkulasi kalori, dan manajemen user.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB
- JWT Secret Key

### Installation
```bash
# Clone repository
git clone <repository-url>
cd LATIHANSEHAT

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env file dengan konfigurasi yang sesuai

# Start development server
npm run dev
```

### Environment Variables
```env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-app-key
NODE_ENV=development
JWT_SECRET=your-jwt-secret
MONGODB_URI=mongodb://localhost:27017/latihansehat
```

## 📖 API Documentation

### Base URL
- **Development:** `http://localhost:3333`

### Authentication
API menggunakan JWT Bearer Token authentication:
```
Authorization: Bearer <your-jwt-token>
```

## 🔗 Endpoints Overview

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrasi user baru | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ❌ |

### Latihan Management (REST)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/latihan` | Tambah latihan baru | ✅ |
| GET | `/latihan` | Ambil semua latihan user | ✅ |
| PUT | `/latihan/{id}` | Update latihan | ✅ |
| DELETE | `/latihan/{id}` | Hapus latihan | ✅ |
| GET | `/latihan/calories/total` | Hitung total kalori | ✅ |

### GraphQL
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/graphql` | GraphQL queries | ✅ |

## 📝 Usage Examples

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:3333/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Tambah Latihan (REST)
```bash
curl -X POST http://localhost:3333/latihan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Lari Pagi",
    "type": "cardio",
    "duration": 30,
    "date": "2024-01-15"
  }'
```

### 3. GraphQL Query
```bash
curl -X POST http://localhost:3333/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "query": "{ latihan { _id name type duration date status } }"
  }'
```

### 4. Update Status Latihan
```bash
curl -X PUT http://localhost:3333/latihan/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "status": "terlaksana"
  }'
```

### 5. Hitung Total Kalori
```bash
curl -X GET http://localhost:3333/latihan/calories/total \
  -H "Authorization: Bearer <your-token>"
```

## 🎯 GraphQL Schema

### Types
```graphql
type Latihan {
  _id: ID!
  name: String!
  type: TypeLatihan!
  duration: Int!
  date: String!
  status: StatusLatihan!
}

enum TypeLatihan {
  cardio
  strength
  flexibility
}

enum StatusLatihan {
  terlaksana
  belum_terlaksana
}
```

### Queries
```graphql
type Query {
  # Ambil semua latihan user
  latihan: [Latihan!]!
  
  # Ambil latihan berdasarkan ID
  latihanById(id: ID!): Latihan
}
```

### Example Queries
```graphql
# Ambil semua latihan
{
  latihan {
    _id
    name
    type
    duration
    date
    status
  }
}

# Ambil latihan berdasarkan ID
query GetLatihanById($id: ID!) {
  latihanById(id: $id) {
    _id
    name
    type
    duration
    date
    status
  }
}

# Selective fields (hanya ambil field yang dibutuhkan)
{
  latihan {
    _id
    name
    status
  }
}
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens:** Expires dalam 7 hari
- **Password Hashing:** Menggunakan bcrypt
- **User Isolation:** User hanya bisa akses data sendiri
- **Token Validation:** Middleware auth untuk protected endpoints

### Input Validation
- **Email Format:** Validasi format email
- **Password Strength:** Minimal 6 karakter
- **Data Types:** Validasi tipe data sesuai schema
- **Required Fields:** Validasi field wajib

### Security Headers
- **CORS:** Cross-Origin Resource Sharing protection
- **Content-Type:** JSON content type validation
- **Authorization:** Bearer token validation

## 📊 Calorie Calculation

### External API Integration
- **Provider:** API Ninjas Calories Burned API
- **Fallback:** 5 kalori per menit jika API gagal
- **Mapping:** Aktivitas Indonesia → English

### Supported Activities
| Indonesian | English | Category |
|------------|---------|----------|
| lari/jogging | running | cardio |
| jalan | walking | cardio |
| sepeda | cycling | cardio |
| renang | swimming | cardio |
| push up | push ups | strength |
| sit up | sit ups | strength |
| squat | squats | strength |
| yoga | yoga | flexibility |
| gym | weight lifting | strength |

## 🐛 Error Handling

### HTTP Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request
- **401:** Unauthorized
- **404:** Not Found
- **500:** Internal Server Error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

### Common Errors
```json
// Authentication errors
{
  "error": "Token tidak ditemukan"
}
{
  "error": "Token tidak valid"
}

// Validation errors
{
  "error": "Email already exists"
}
{
  "error": "Password atau Email salah"
}

// Not found errors
{
  "error": "Latihan tidak ditemukan"
}
{
  "error": "User tidak ditemukan"
}
```

## 🧪 Testing

### Manual Testing Tools
- **Postman:** Import swagger.yaml untuk collection
- **Insomnia:** REST client testing
- **GraphQL Playground:** `http://localhost:3333/graphql`
- **curl:** Command line testing

### Test Data Examples
```json
// User registration
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

// Latihan data
{
  "name": "Lari Pagi",
  "type": "cardio",
  "duration": 30,
  "date": "2024-01-15"
}
```

## 📚 Additional Resources

### Swagger Documentation
- **File:** `swagger.yaml`
- **Viewer:** Import ke Swagger Editor atau Postman
- **URL:** `https://editor.swagger.io/`

### GraphQL Tools
- **Postman:** Untuk testing GraphQL queries
- **Introspection:** Schema exploration via queries
- **Query Validation:** Server-side validation

### Database Schema
```javascript
// User Model
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}

// Latihan Model
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  type: String (enum),
  duration: Number,
  date: Date,
  status: String (enum),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment



## 📞 Support

Untuk pertanyaan atau issue, silakan hubungi:
- **Email:** support@latihansehat.com
- **GitHub Issues:** [Repository Issues](https://github.com/your-repo/issues)
- **Documentation:** Lihat `swagger.yaml` untuk detail lengkap

---

**Last Updated:** January 2024  
**API Version:** 1.0.0  
**Documentation Version:** 1.0.0