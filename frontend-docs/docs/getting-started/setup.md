---
title: Setup และ Bootstrapping
---

## สิ่งที่ต้องมี

- Node.js >= 18
- npm
- backend รันที่ http://localhost:3000

## สร้างโปรเจกต์ frontend (ตัวอย่าง Vite + React)

```bash
npm create vite@latest fastwork-frontend -- --template react
cd fastwork-frontend
npm install
```

## แพ็กเกจที่แนะนำ

```bash
npm install axios @tanstack/react-query react-router-dom zod
```

## สร้างไฟล์ env

ไฟล์ .env.local

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_API_KEY=true
VITE_INTERNAL_API_KEY=change-this
```

## Run

```bash
npm run dev
```

## ข้อควรรู้

- ถ้า backend เปิด API_KEY_REQUIRED=true ต้องส่ง x-api-key ใน business endpoints
- auth เป็น session-based ต้องส่ง cookie ทุก request ที่เกี่ยวกับ session
