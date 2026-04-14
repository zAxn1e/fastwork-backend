---
title: ภาพรวมคู่มือ Frontend
slug: /
---

คู่มือนี้จัดทำเพื่อให้ทีม frontend เริ่มพัฒนาได้ทันที โดยเชื่อมต่อกับ backend ปัจจุบันอย่างถูกต้องและลดการลองผิดลองถูก

## เป้าหมาย

- เชื่อมระบบ auth แบบ JWT ได้ครบ
- ใช้งาน API หลัก (gigs, orders, reviews, categories) ได้ครบ
- รองรับ admin flow (dashboard + manage resources) สำหรับ role `ADMIN`
- จัดการ profile image และ media assets ได้ครบ flow
- มีมาตรฐานการจัดโครงสร้าง, state, และ testing ที่ทำงานเป็นทีมได้ง่าย

## เอกสารที่ควรใช้ร่วมกัน

<!-- - Swagger UI (live API): `${VITE_API_BASE_URL}/docs`
- OpenAPI JSON: `${VITE_API_BASE_URL}/openapi.json` -->
- Swagger UI (live API): `https://api.noctradev.com/docs`
- OpenAPI JSON: `https://api.noctradev.com/openapi.json`
- Backend summary: ../docs/API.md

## ลำดับเริ่มทำที่แนะนำ

1. ตั้งค่า project + env ฝั่ง frontend
2. ทำ HTTP client กลาง (Bearer token + x-api-key)
3. ทำ auth/JWT flow
4. ทำ profile + media upload
5. ทำหน้าหลักของระบบ
6. ทำ test checklist ก่อน merge
