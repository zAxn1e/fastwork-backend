---
title: API Key และ Security Integration
---

## x-api-key ใช้เมื่อไร

- ถ้า backend ตั้ง API_KEY_REQUIRED=true -> ต้องส่ง x-api-key ใน business endpoints
- endpoint กลุ่ม auth/profile/media ที่ใช้ session ยังควรใช้การตั้งค่าเดียวกันของโปรเจกต์

## แนวปฏิบัติ

- เก็บ key ใน env เท่านั้น
- อย่า hardcode key ใน source code
- แยก env ของ dev/staging/prod

## Header strategy

- ใช้ interceptor กลางระดับ http client
- ไม่กระจายเขียน header ซ้ำในแต่ละหน้า

## ข้อควรระวัง

- ถ้าเปิด API_KEY_REQUIRED ใน backend แต่ frontend ไม่ส่ง header จะเจอ 401
- ถ้า browser block cookie หรือข้าม withCredentials จะดูเหมือน login ไม่ติด
