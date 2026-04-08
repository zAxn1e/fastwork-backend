---
title: Env และ HTTP Client
---

## Env mapping

- VITE_API_BASE_URL -> backend base URL
- VITE_ENABLE_API_KEY -> เปิด/ปิดการส่ง x-api-key
- VITE_INTERNAL_API_KEY -> ค่า key ที่ต้องส่ง

## ตัวอย่าง http client (axios)

```ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENABLE_API_KEY = String(import.meta.env.VITE_ENABLE_API_KEY) === 'true';
const INTERNAL_API_KEY = import.meta.env.VITE_INTERNAL_API_KEY;

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  if (ENABLE_API_KEY) {
    config.headers['x-api-key'] = INTERNAL_API_KEY;
  }
  return config;
});
```

## Response และ Error format

สำเร็จ

```json
{
  "success": true,
  "data": {}
}
```

ผิดพลาด

```json
{
  "success": false,
  "message": "..."
}
```

แนะนำให้มี helper กลางสำหรับ map error ไปยัง toast
