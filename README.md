# Project phim

Dự án đã được sắp xếp lại theo cấu trúc:

```text
project/
├── backend/
└── frontend/
```

## Backend (Node.js + Express)

Thư mục: `backend/`

Cấu trúc chính:

- `config/`: cấu hình hệ thống (MongoDB)
- `models/`: Mongoose models
- `controllers/`: xử lý nghiệp vụ
- `routes/`: định nghĩa API endpoints
- `middleware/`: middleware dùng chung

Chạy backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API chính:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/phim-moi`
- `GET /api/phim/:slug`
- `POST /api/favorites`
- `GET /api/favorites`

## Frontend (React + Vite)

Thư mục: `frontend/`

Chạy frontend:

```bash
cd frontend
npm install
npm run dev
```

Cấu trúc frontend:

- `src/pages`
- `src/components`
- `src/services`
- `src/context`
