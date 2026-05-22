# Job Application Tracker API

A production-ready backend system to track job applications with authentication, caching, rate limiting, and containerized deployment.

Built using Node.js + TypeScript + Express, PostgreSQL, Redis, JWT authentication, and Docker.

---

# Features

- JWT Authentication (Register/Login)
- Multi-user job tracking
- CRUD for job applications
- Search + Pagination
- Redis caching for faster responses
- Rate limiting using Redis
- PostgreSQL relational database
- Fully containerized using Docker

---

# Tech Stack

- Node.js (Runtime)
- Express.js (Backend framework)
- TypeScript
- PostgreSQL (Database)
- Redis (Cache + Rate Limiting)
- JWT (Authentication)
- Docker & Docker Compose
- Swagger/OpenAPI

---

# Project Structure

src/
├── controllers/
├── routes/
├── middleware/
├── db/
├── utils/
├── config/
└── app.ts
sql/
|─ schema.sql

Dockerfile
docker-compose.yml
.env

---

# Authentication (JWT)

# Flow

1. User registers
2. User logs in
3. Server generates JWT token
4. Token is used for protected routes

# Usage

Authorization header:
Authorization: Bearer <token>

---

# API Endpoints

## Auth

POST /api/auth/register  
POST /api/auth/login

---

# Jobs (Protected)

POST /api/jobs?add
GET /api/jobs?page=1&limit=10&search=google  
GET /api/jobs?page=1&limit=10
PUT /api/jobs/:id
DELETE /api/jobs/:id

---

# Search Logic

SELECT \* FROM jobs
WHERE user_id=1
AND (company ILIKE '%google%'
OR status ILIKE '%google%'
OR notes ILIKE '%google%'
);

---

# Redis Features

Used for:

- caching job responses
- rate limiting requests

Cache key:
jobs:userId:page:1:limit:10

---

# Rate Limiting

- Prevents API abuse
- Implemented using Redis
- Limits requests per user/IP

---

# PostgreSQL Schema

create table IF not exists users(
id serial primary key,
name varchar(100) not null,
email varchar(100) unique not null,
password varchar(200) not null,
created_at timestamp default current_timestamp
);

create table if not exists jobs(
id serial primary key,
company varchar(200) not null,
position varchar(200) not null,
status varchar(100) not null default 'Applied' ,
location varchar(200),
salary integer,
user_id integer references users(id) on delete cascade,
notes text,
created_at timestamp default current_timestamp
);

---

# Docker Setup

Services:

- app (Node.js backend)
- postgres (Database)
- redis (Cache + rate limiting)

---

# Run project

docker compose up --build

---

# docker-compose.yml

version: "3.8"

services:
app:
build: .
container_name: job_tracker
ports: - "5000:5000"
env_file: - .env
depends_on: - postgres - redis
volumes: - .:/app - /app/node_modules

postgres:
image: postgres:16
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: password
POSTGRES_DB: job_tracker
ports: - "5432:5432"
volumes: - postgres_data:/var/lib/postgresql/data

redis:
image: redis:7
ports: - "6379:6379"

volumes:
postgres_data:

---

# Environment Variables

PORT=5000

DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=job_tracker
DB_PORT=5432

JWT_SECRET=your_secret_key

REDIS_URL=your_redis_url

---

# Run Locally

npm install  
npm run dev

---

# Run with Docker

docker compose up --build

---

# Production

npm run build  
npm start

---

# API Documentation (Swagger)

Open Swagger UI:

http://localhost:5000/api-docs

For protected APIs:

- Login using /api/auth/login
- Copy JWT token
- Click Authorize in Swagger UI
- Enter: <your_token>

---

# Highlights

- JWT authentication
- Multi-user job tracking
- Redis caching
- Rate limiting
- PostgreSQL relational schema
- Dockerized setup
- Swagger/OpenAPI documentation

---

# Future Improvements

- Email notifications
- Resume upload
- Role-based access (Admin/User)
- Analytics dashboard

---

# Author

Backend project built using Node.js, TypeScript, PostgreSQL, Redis, and Docker,Swagger/OpenAPI
.
