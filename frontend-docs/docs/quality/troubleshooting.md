---
title: Troubleshooting ที่เจอบ่อย
---

## 401 หลัง login แล้ว

สาเหตุที่พบบ่อย

- ไม่ได้ส่ง withCredentials/credentials include
- Browser policy บล็อก cookie
- เรียกโดเมน/พอร์ตไม่ตรงกับที่ตั้งค่า

## Upload ไม่ผ่าน

เช็ก

- field name ถูกต้องหรือไม่ (image สำหรับ profile, file สำหรับ media-assets)
- ขนาดไฟล์เกิน MAX_UPLOAD_FILE_SIZE_MB หรือไม่
- mime type เป็นไฟล์ภาพที่รองรับหรือไม่

## รูปไม่แสดง

เช็ก

- ต่อ base URL กับ relative URL แล้วหรือยัง
- backend เปิด static /media แล้วหรือยัง
- ไฟล์ถูกลบไปแล้วหรือไม่

## x-api-key error

เช็ก

- backend เปิด API_KEY_REQUIRED หรือไม่
- frontend env ส่ง key ถูกค่าในทุก request หรือไม่

## CORS หรือ cookie issue เมื่อ deploy

ถ้า frontend/backend อยู่คนละโดเมนจริง

- ตั้งค่า secure cookie และ sameSite ให้เหมาะกับ environment
- ตั้ง reverse proxy ให้รองรับ cookie forwarding
