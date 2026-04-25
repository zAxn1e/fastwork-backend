# Teammate Backend Instructions

คู่มือนี้สำหรับส่งให้เพื่อนในทีมเพื่อรับช่วง backend แล้วรันได้ทันทีแบบ local

## 1) Prerequisites

- Node.js LTS (18/20/22)
- npm
- Docker Desktop (สำหรับ PostgreSQL ใน `docker-compose.yml`)

## 2) Setup ครั้งแรก

```bash
npm install
copy .env.example .env
docker compose up -d
npm run prisma:push
npm run db:seed
```

> ค่า default ใน `.env.example` ใช้รัน local ได้ทันที

## 3) Run backend

```bash
npm run dev
```

จุดตรวจหลัก:

- Health: `http://localhost:3000/health`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
- Frontend guide (ผ่าน backend): `http://localhost:3000/frontend-guide`

## 4) บัญชีทดสอบจาก seed

- Admin: `admin@internal.local` / `Password123!`
- Freelancer: `freelancer1@internal.local` / `Password123!`
- Client: `client1@internal.local` / `Password123!`

## 5) สำหรับทีม frontend ที่จะเชื่อม API

ตั้งค่า `.env.local` ฝั่ง frontend อย่างน้อย:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_API_KEY=true
VITE_INTERNAL_API_KEY=change-this
```

หมายเหตุ:

- ถ้า backend ตั้ง `API_KEY_REQUIRED=true` ต้องส่ง `x-api-key` กับ business endpoints (`/categories`, `/gigs`, `/orders`, `/reviews`, `/admin`)
- endpoint ที่ใช้ JWT ต้องแนบ `Authorization: Bearer <token>`

## 6) คำสั่งที่ใช้บ่อย

```bash
docker compose down
docker compose down -v
npm run prisma:generate
npm run prisma:studio
```
