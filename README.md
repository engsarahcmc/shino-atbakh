# 🍳 شنو أطبخ؟ — Shno Atbakh?

مشروع تخرج Full-Stack: تطبيق يقترح وصفات حسب المكونات اللي عندك، مع مساعدة ذكية اسمها **مرام**.

## ترتيب المشروع

```
shno-atbakh/
├── client/   الواجهة (React + Vite + Tailwind)
└── server/   الباكند (Node.js + Express + PostgreSQL + Gemini)
```

## التشغيل

### 1. السيرفر (المنفذ 3000)
```bash
cd server
npm install
cp .env.example .env   # ثم عبّي القيم
npm run dev
```

### 2. الواجهة (المنفذ 5173)
```bash
cd client
npm install
npm run dev
```

## الفريق

| العضوة | الدور |
|---|---|
| سارة | Team leader — ميزة «شنو أطبخ؟» ومساعدة الـ AI «مرام» (frontend + backend) |
| فاطمة | Backend — المستخدمين، المفضلة، الاستكشاف، وجبات الأسبوع، قاعدة البيانات |
| زهراء | Frontend — الصفحات والهوية البصرية |

## ميزة مرام (AI)

```http
POST /api/suggest
```

```json
{ "ingredients": ["دجاج", "رز"], "people": 2, "mealType": "غداء", "lang": "ar" }
```

`people` و`mealType` و`lang` اختيارية. `lang` تكون `ar` أو `en`.

تفاصيل روابط الباكند الباقية موجودة في [`server/README.md`](server/README.md).

> رسومات شخصية مرام مولّدة بمساعدة الذكاء الاصطناعي.

## الحسابات والصلاحيات

- كل شخص يسجّل بالموقع يصير **مستخدم**.
- **المدير** (الدور `admin` بجدول `roles`) يفتح **لوحة التحكم** (`/admin`): يشوف الإحصائيات، ويبحث بالمستخدمين، ويغيّر صلاحياتهم، ويوقف أو يفعّل أو يحذف حساباتهم.
- السيرفر يقرأ رقم دور المدير من جدول `roles` حسب الاسم تلقائياً عند التشغيل.
- لإعداد أول مدير، شغّلي الملف `server/sql/admin-setup.sql` على قاعدة البيانات، بعد ما تكتبين إيميلك بداخله.

| الرابط | الوظيفة |
|---|---|
| `GET /api/admin/stats` | أرقام لوحة التحكم |
| `GET /api/admin/users?search=` | قائمة المستخدمين |
| `PATCH /api/admin/users/:id/role` | `{ "role": "user" \| "admin" }` |
| `PATCH /api/admin/users/:id/status` | `{ "isActive": true \| false }` |
| `DELETE /api/admin/users/:id` | حذف مستخدم |

كل روابط `/api/admin` تحتاج تسجيل دخول بحساب مدير.

## اشتراك Premium (الدفع تجريبي)

- **المجاني:** 5 اقتراحات من مرام باليوم (الزائر 3)، وكل الوصفات العادية.
- **بريميوم:** مرام بلا حدود، ووصفات حصرية (البرياني، تبسي الباذنجان، كبة حلب، المسكوف)، وبدون إعلانات.
- **الأسعار:** شهري 5,000 د.ع، سنوي 48,000 د.ع.
- **الدفع محاكاة فقط** (زين كاش، كي كارد، فاست پاي): ما ينسحب أي مبلغ، بس تنسجل العملية ويتفعل الاشتراك.
- السيرفر ينشئ جداول `subscriptions` و`ai_usage` وحده عند التشغيل (الأوامر موجودة بـ `server/sql/premium.sql`).

| الرابط | الوظيفة |
|---|---|
| `GET /api/premium/plans` | الخطط والأسعار وحدود الاستخدام |
| `GET /api/premium/status` | حالة اشتراك المستخدم وسجل عملياته |
| `POST /api/premium/subscribe` | `{ "plan": "monthly" \| "yearly", "method": "zaincash" \| "qicard" \| "fastpay" }` |
| `POST /api/premium/cancel` | إلغاء الاشتراك |

إذا خلص حد مرام اليومي، `POST /api/suggest` يرجع `429` مع `code: "DAILY_LIMIT"`.
