# Dental Clinic Full‑Stack

واجهة استقبال عيادة أسنان مبنية كتطبيق Full‑Stack قابل للتوسع.

## Stack
- Next.js (App Router) + TypeScript
- NestJS REST API
- Prisma ORM 7 + PostgreSQL
- TanStack Query للـ server state
- Zustand للـ UI/local state فقط
- Zod للتحقق من المدخلات
- React Hook Form
- Docker Compose لقاعدة PostgreSQL المحلية

## الهيكل
```text
apps/
  web/   # Next.js
  api/   # NestJS + Prisma
```

## التشغيل
1. انسخ ملفات البيئة:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```
2. شغل PostgreSQL:
```bash
npm run db:up
```
3. ثبت الحزم:
```bash
npm install
```
4. أنشئ Prisma Client ثم migration:
```bash
npm run db:generate
npm run db:migrate -- --name init
```
5. شغل الواجهة والـ API معًا:
```bash
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:3001/api

## توزيع المسؤوليات
- **TanStack Query:** المرضى، قائمة الانتظار، أي بيانات تأتي من NestJS.
- **Zustand:** المريض المحدد حاليًا وحالة النوافذ/الفلاتر المحلية.
- **Zod:** validation قبل الإرسال وفي NestJS عند الاستقبال.
- **Prisma:** طبقة الوصول للبيانات والعلاقات والمigrations.

## API المبدئي
- `GET /api/patients?search=`
- `POST /api/patients`
- `GET /api/queue`

هذا Skeleton مقصود ليكون نقطة بداية نظيفة، ويمكن بعده إضافة Visits, Appointments, Treasury, Payments, Users, Roles, Audit Log وWebSocket queue updates.
