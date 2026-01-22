# Fashion Store Backend (NestJS + PostgreSQL)

This repository contains a starter backend for a fashion store using NestJS, PostgreSQL, and cookie-based JWT authentication.

Features
- User registration and login (password hashed with bcrypt)
- HttpOnly cookie authentication (JWT stored in cookie)
- Role-based admin system (admin role)
- Item upload with image (Multer, saved to /uploads)
- Item listing and retrieval
- Activity tracking for user actions (upload, purchase, login)
- TypeORM for PostgreSQL integration

Quick start
1. Copy `.env.example` to `.env` and update values (DB credentials, JWT secret).
2. Install deps:
   npm install
3. Create DB:
   - Create a PostgreSQL database named the same as `DATABASE_NAME`
4. Start dev server:
   npm run start:dev

Notes
- TypeORM is configured with `synchronize: true` for development. Turn this off in production and use migrations.
- Uploaded files are stored in `uploads/`. For production use S3 or another object store.