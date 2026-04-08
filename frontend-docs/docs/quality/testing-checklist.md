---
title: Testing Checklist ก่อนส่งงาน
---

## Auth

- register สำเร็จและได้ session
- login สำเร็จและเรียก /auth/me ได้
- logout สำเร็จและ /auth/me กลับเป็น 401

## Profile

- get/update profile ผ่าน
- upload/delete profile image ผ่าน
- แสดงรูปจาก URL ที่คืนจาก backend ได้

## Media Assets

- upload image ได้
- list media เห็นรายการล่าสุด
- มี thumbnailUrl และ webpUrl
- delete media แล้ว list อัปเดต

## API Key

- เมื่อ backend บังคับ key -> request ที่ไม่มี key ต้อง fail 401
- เมื่อ backend ไม่บังคับ key -> request ต้องผ่านโดยไม่ส่ง key

## Regression

- gigs/orders/reviews ที่มีอยู่เดิมยังใช้งานได้
- หน้า docs ยังเปิดได้
