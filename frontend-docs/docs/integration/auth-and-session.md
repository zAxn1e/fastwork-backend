---
title: Auth และ Session Flow
---

## Endpoint สำคัญ

- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/me

## Flow ที่แนะนำ

1. ผู้ใช้ register/login
2. backend set session cookie
3. frontend เรียก /auth/me เพื่อ sync user state
4. เมื่อ refresh หน้า ให้เรียก /auth/me ตอน app boot

## Route guard

- protected routes: /profile, /media, /orders
- ถ้า /auth/me ตอบ 401 ให้ redirect ไป /login

## ตัวอย่าง pseudo code

```ts
async function bootstrapAuth() {
  try {
    const me = await http.get('/auth/me');
    setCurrentUser(me.data.data.user);
  } catch {
    setCurrentUser(null);
  }
}
```

## Logout

- เรียก /auth/logout
- clear local auth state
- redirect ไปหน้า login
