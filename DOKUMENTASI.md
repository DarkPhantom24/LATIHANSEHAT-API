# LATIHANSEHAT - Workout Tracker

Platform tracking latihan kesehatan modern dengan frontend yang responsif dan backend API yang powerful. Dilengkapi dengan autentikasi JWT, REST API, GraphQL, dan dashboard interaktif.

## 🚀 Teknologi

### Backend
- **Framework:** AdonisJS 6 (TypeScript)
- **Database:** MongoDB dengan Mongoose
- **Authentication:** JWT (JSON Web Token)
- **API:** REST + GraphQL
- **Runtime:** Node.js

### Frontend
- **Styling:** Tailwind CSS (CDN)
- **Icons:** Font Awesome 6
- **JavaScript:** Vanilla ES6+
- **Features:** Responsive Design, Interactive Calendar, Real-time Updates

## 📋 Fitur Lengkap

### Backend Features
- ✅ User Registration & Login
- ✅ JWT Authentication & Authorization
- ✅ CRUD Latihan (Create, Read, Update, Delete)
- ✅ REST API endpoints
- ✅ GraphQL queries dengan field selection
- ✅ User ownership validation
- ✅ Status latihan (terlaksana/belum terlaksana)
- ✅ Input validation & error handling

### Frontend Features
- ✅ Landing page dengan smooth scrolling
- ✅ Fixed navbar dengan scroll effects
- ✅ User authentication (login/register)
- ✅ Interactive dashboard dengan stats
- ✅ Calendar view dengan workout details
- ✅ Real-time workout management
- ✅ GraphQL field filtering
- ✅ Responsive design untuk mobile & desktop

## 🛠️ Setup & Installation

### 1. Clone & Install
```bash
git clone <repository-url>
cd LATIHANSEHAT
npm install
```

### 2. Environment Variables
Buat file `.env`:
```env
PORT=3333
APP_KEY=your-app-key
NODE_ENV=development

# Database
DB_CONNECTION=mongodb://localhost:27017/latihansehat

# JWT
JWT_SECRET=your-jwt-secret-key
```

### 3. Jalankan Server
```bash
npm run dev
```

Server berjalan di: `http://localhost:3333`

## 📚 API Documentation

### Base URL
```
http://localhost:3333
```

---

## 🔐 Authentication

### Register
**POST** `/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User berhasil didaftarkan",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
**POST** `/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Logout
**POST** `/logout`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🏃‍♂️ REST API - Latihan

**Semua endpoint latihan memerlukan authentication header:**
```
Authorization: Bearer <token>
```

### 1. Tambah Latihan
**POST** `/latihan`

**Body:**
```json
{
  "name": "Push Up",
  "type": "strength",
  "duration": 15,
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "message": "Latihan berhasil ditambahkan",
  "latihan": {
    "_id": "latihan_id",
    "name": "Push Up",
    "duration": 15,
    "date": "2024-01-15T00:00:00.000Z",
    "status": "belum terlaksana",
    "userId": "user_id"
  }
}
```

### 2. Lihat Semua Latihan
**GET** `/latihan`

**Response:**
```json
{
  "message": "Data latihan berhasil diambil",
  "latihan": [
    {
      "_id": "latihan_id",
      "name": "Push Up",
      "duration": 15,
      "date": "2024-01-15T00:00:00.000Z",
      "status": "belum terlaksana"
    }
  ]
}
```

### 3. Update Latihan
**PUT** `/latihan/:id`

**Body (semua field opsional):**
```json
{
  "name": "Push Up Updated",
  "duration": 20,
  "date": "2024-01-16",
  "status": "terlaksana"
}
```

**Response:**
```json
{
  "message": "Latihan berhasil diupdate",
  "latihan": {
    "_id": "latihan_id",
    "name": "Push Up Updated",
    "duration": 20,
    "status": "terlaksana"
  }
}
```

### 4. Hapus Latihan
**DELETE** `/latihan/:id`

**Response:**
```json
{
  "message": "Latihan berhasil dihapus"
}
```

---

## 🔍 GraphQL API

**Endpoint:** `POST /graphql`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Schema Types

```graphql
enum StatusLatihan {
  terlaksana
  belum_terlaksana
}

enum TypeLatihan {
  cardio
  strength
  flexibility
}

type Latihan {
  _id: ID!
  name: String!
  type: TypeLatihan!
  duration: Int!
  date: String!
  status: StatusLatihan!
}

type Query {
  latihan: [Latihan!]!
  latihanById(id: ID!): Latihan
}
```

### Query Examples

#### 1. Ambil Semua Latihan (Field Selection)
```json
{
  "query": "{ latihan { _id name duration status } }"
}
```

#### 2. Ambil Hanya Nama dan Durasi
```json
{
  "query": "{ latihan { name duration } }"
}
```

#### 3. Ambil Latihan Berdasarkan ID
```json
{
  "query": "query GetLatihan($id: ID!) { latihanById(id: $id) { name duration status } }",
  "variables": { "id": "latihan_id" }
}
```

**Response GraphQL:**
```json
{
  "data": {
    "latihan": [
      {
        "name": "Push Up",
        "duration": 15,
        "status": "terlaksana"
      }
    ]
  }
}
```

---

## 👥 User Management

### Lihat Semua User
**GET** `/users`

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Hapus User
**DELETE** `/users/:id`

---

## 🔒 Security Features

- **JWT Authentication** - Semua endpoint latihan dilindungi
- **User Ownership** - User hanya bisa CRUD latihan miliknya sendiri
- **Password Hashing** - Password di-hash sebelum disimpan
- **Input Validation** - Validasi data input
- **CORS Protection** - Cross-origin request protection

---

## 📊 Data Models

### User Model
```typescript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Latihan Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  name: String (required),
  type: String (enum: ['cardio', 'strength', 'flexibility'], required),
  duration: Number (required, dalam menit),
  date: Date (required),
  status: String (enum: ['terlaksana', 'belum terlaksana'], default: 'belum terlaksana'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing dengan Postman

### 1. Register/Login
- POST `/register` atau `/login`
- Copy `token` dari response

### 2. Set Authorization
- Tambah header: `Authorization: Bearer <token>`

### 3. Test Endpoints
- CRUD latihan dengan REST API
- Query dengan GraphQL

### 4. GraphQL di Postman
- Pilih tab **GraphQL** (bukan Body)
- Masukkan query di Query box
- Masukkan variables di Variables box

---

## 🚨 Error Handling

### Common Errors

**401 Unauthorized:**
```json
{
  "error": "Token tidak ditemukan"
}
```

**404 Not Found:**
```json
{
  "error": "Latihan tidak ditemukan"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Gagal menambahkan latihan"
}
```

---

## 📝 Status Latihan

- `belum terlaksana` - Default status untuk latihan baru
- `terlaksana` - Status setelah latihan diselesaikan

---

## 🔄 API Comparison

| Feature | REST API | GraphQL |
|---------|----------|---------|
| **Endpoint** | Multiple (`/latihan`, `/users`) | Single (`/graphql`) |
| **Data Fetching** | Fixed structure | Field selection |
| **Use Case** | CRUD operations | Flexible queries |
| **Caching** | Easy | Complex |
| **Learning Curve** | Easy | Medium |

---

## 🎯 Best Practices

1. **Selalu gunakan HTTPS** di production
2. **Rotate JWT secrets** secara berkala
3. **Validate input** di semua endpoint
4. **Rate limiting** untuk mencegah abuse
5. **Logging** untuk monitoring
6. **Database indexing** untuk performa

---

## 🖥️ Frontend Usage

### Akses Aplikasi
1. Buka `frontend/index.html` di browser
2. Klik "Get Started" untuk login/register
3. Setelah login, akses dashboard untuk:
   - Menambah workout baru
   - Melihat calendar dengan workout details
   - Filter data dengan GraphQL field selection
   - Manage workout status (complete/edit/delete)

### Fitur Dashboard
- **Stats Overview**: Total workouts, completed, minutes exercised
- **Add Workout Form**: Form untuk menambah latihan baru
- **Interactive Calendar**: Calendar dengan detail workout per hari
- **Workout List**: List semua workout dengan filter options
- **GraphQL Filter**: Checkbox untuk memilih field yang ditampilkan

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**Happy Coding! 🚀**