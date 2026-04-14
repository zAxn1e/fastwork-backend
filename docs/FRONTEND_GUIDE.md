# Frontend Integration Guide

หมายเหตุ: ตอนนี้มีคู่มือแบบ Docusaurus ที่ละเอียดกว่าอยู่ในโฟลเดอร์ frontend-docs/

คู่มือนี้สรุปแนวทางทำ frontend ให้เชื่อมกับ backend นี้แบบใช้งานจริงได้เร็ว และยังดูแลรักษาง่ายสำหรับงานทีม

## 1) เป้าหมายของ frontend

- แสดงข้อมูลหลัก: categories, gigs, orders, reviews
- รองรับ auth แบบ JWT (register/login/logout/me)
- รองรับ profile และ upload รูปโปรไฟล์
- รองรับ media upload ทั่วไป พร้อม preview thumbnail
- รองรับ internal security ผ่าน x-api-key (เมื่อ backend เปิดใช้งาน)

## 2) แนะนำ stack ฝั่ง frontend

เลือกชุดที่ทีมถนัด เช่น

- React + Vite + React Router
- State management: React Query หรือ Zustand
- HTTP client: fetch หรือ axios
- UI: TailwindCSS / MUI / Ant Design (อย่างใดอย่างหนึ่ง)

## 3) โครงสร้าง frontend ที่แนะนำ

```text
src/
  app/
    router.tsx
    providers.tsx
  config/
    env.ts
  lib/
    http.ts
    auth.ts
  features/
    auth/
      pages/LoginPage.tsx
      pages/RegisterPage.tsx
    profile/
      pages/ProfilePage.tsx
      components/ProfileImageUpload.tsx
    media/
      pages/MediaLibraryPage.tsx
      components/MediaUploadForm.tsx
    gigs/
      pages/GigListPage.tsx
      pages/GigDetailPage.tsx
    orders/
      pages/OrderListPage.tsx
  shared/
    components/
    hooks/
    types/
```

## 4) Frontend env ที่ควรมี

ตัวอย่าง (เช่นไฟล์ .env.local ของ Vite)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_INTERNAL_API_KEY=change-this
VITE_ENABLE_API_KEY=true
```

แนวคิด

- ถ้า backend ใช้ API_KEY_REQUIRED=true ให้ frontend ส่ง x-api-key ใน business API กลุ่ม /categories, /gigs, /orders, /reviews
- ถ้า API_KEY_REQUIRED=false สามารถไม่ส่งได้ แต่ควรเก็บโค้ดให้รองรับไว้

## 5) การตั้งค่า HTTP client สำคัญมาก

## 5.1 ต้องส่ง Authorization Bearer ใน endpoint ที่ต้อง login

- เก็บ `accessToken` จาก `/auth/register` หรือ `/auth/login`
- แนบ header: `Authorization: Bearer <accessToken>`

## 5.2 ใส่ x-api-key แบบ conditional

ตัวอย่างแนวคิด

```ts
const shouldSendApiKey = import.meta.env.VITE_ENABLE_API_KEY === 'true';

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

if (shouldSendApiKey) {
  headers['x-api-key'] = import.meta.env.VITE_INTERNAL_API_KEY;
}
```

## 5.3 จัดการ error format ให้เป็นมาตรฐาน

backend ส่ง error รูปแบบ

```json
{
  "success": false,
  "message": "..."
}
```

frontend ควร map message ไปแสดง toast/alert ให้ user เข้าใจ

## 6) Auth (JWT) flow ที่แนะนำ

## 6.1 Register

- เรียก POST /auth/register
- สำเร็จแล้วถือว่า login ทันที (ได้ JWT token)
- redirect ไปหน้า profile หรือ dashboard

## 6.2 Login

- เรียก POST /auth/login
- สำเร็จแล้วเก็บ token แล้วเรียก GET /auth/me เพื่อ sync user state

## 6.3 Logout

- เรียก POST /auth/logout พร้อม Authorization header
- clear user state ใน frontend
- redirect ไปหน้า login

## 6.4 Route guard

- หน้า private (profile/media/orders/create-edit gig) ต้องเช็ค auth state
- ถ้าเรียก /auth/me แล้วได้ 401 ให้ redirect ไป /login

## 7) Profile + Profile Image flow

## 7.1 ดึงและแก้ไข profile

- GET /profile
- PATCH /profile

## 7.2 อัปโหลดรูปโปรไฟล์

- POST /profile/image
- Content-Type เป็น multipart/form-data
- field ต้องชื่อ image

หลังอัปโหลดสำเร็จจะได้ profileImageUrl เช่น /media/profiles/...

frontend ต้องต่อ base URL ก่อนแสดงภาพ

```ts
const avatarUrl = `${API_BASE_URL}${user.profileImageUrl}`;
```

## 8) Generic Media Assets flow

## 8.1 Upload media

- POST /media-assets/upload
- multipart/form-data
- field ชื่อ file

## 8.2 แสดง media library

- GET /media-assets
- ใช้ thumbnailUrl แสดง grid เร็วกว่าใช้ไฟล์ใหญ่

## 8.3 ดู media detail

- GET /media-assets/:id
- ใช้ webpUrl สำหรับ preview เต็ม

## 8.4 ลบ media

- DELETE /media-assets/:id

## 8.5 Gig media upload/delete

- POST /gigs/:id/media/upload (field: file, ต้องเป็นเจ้าของ gig และต้องมี JWT)
- GET /gigs/:id/media
- DELETE /gigs/:id/media/:mediaId (ต้องเป็นเจ้าของ gig และต้องมี JWT)
- อัปเดต list หลังลบ

หมายเหตุ

- backend มี orphan cleanup อัตโนมัติอยู่แล้ว ไม่ต้องให้ frontend จัดการไฟล์ค้าง

## 9) หน้า UI ขั้นต่ำที่ควรมี

- Login Page
- Register Page
- Profile Page (แก้ชื่อ/bio + อัปโหลดรูป)
- Media Library Page (upload/list/delete)
- Gig List + Filter Page
- Gig Manage Page (create/edit + upload media)
- Order List Page

## 10) React Query key ที่แนะนำ

- ['auth','me']
- ['profile']
- ['media','list']
- ['media','detail', id]
- ['gigs', filters]
- ['orders', filters]

เมื่อ upload/delete media ให้ invalidate ['media','list']

## 11) Checklist ก่อนส่งงาน

- login/register/logout ทำงานครบ
- refresh หน้าแล้วยังรักษาสถานะ login ได้ (ผ่าน token storage ที่ปลอดภัย)
- upload profile image ได้จริง
- upload media ได้และเห็น thumbnail
- delete media แล้ว list อัปเดต
- เมื่อไม่มี x-api-key (ในกรณีบังคับ) frontend แสดงข้อความ error ชัดเจน
- ทุก request ที่ต้อง login มี Authorization: Bearer แนบแล้ว

## 12) ปัญหาที่เจอบ่อย

- ลืมส่ง Authorization Bearer token ทำให้ /auth/me หรือ profile/media เป็น 401
- ส่ง field upload ผิดชื่อ (ต้องเป็น image หรือ file ตาม endpoint)
- ลืมส่ง x-api-key ตอนเปิด API_KEY_REQUIRED=true
- นำ URL รูปไปใช้โดยไม่ต่อ API base URL

## 13) ลำดับเริ่มทำจริง (แนะนำ)

1. ทำ HTTP client กลาง + env config
2. ทำ auth flow ก่อน (register/login/me/logout)
3. ทำ profile + profile image
4. ทำ media assets upload/list/delete
5. ทำ gigs/orders/reviews UI
6. ปรับ UX และ error handling ให้สมบูรณ์
