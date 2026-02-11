# Professional Express Backend

Cấu trúc dự án:

- `config/`: cấu hình hệ thống (MongoDB)
- `models/`: Mongoose models
- `controllers/`: xử lý nghiệp vụ
- `routes/`: định nghĩa API endpoints
- `middleware/`: middleware dùng chung

## Cài đặt

```bash
npm install
cp .env.example .env
npm run dev
```

## API chính

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

- `GET /api/phim-moi`
- `GET /api/phim/:slug`
