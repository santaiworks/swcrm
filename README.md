# SantaiWorks CRM

A modern CRM platform built with Next.js (Frontend) and FastAPI/Python (Backend).

## 🚀 Project Overview

SantaiWorks CRM is designed to streamline lead management, deal tracking, and organizational interactions. It features a robust dashboard, consolidated lead views, and comprehensive activity logging.

## 📁 Repository Structure

```text
santaiworks-crm/
├── backend/          # FastAPI application (Python)
├── frontend/         # Next.js application (React/TypeScript)
├── docker-compose.yml # Container orchestration
└── uploads/          # Shared directory for file attachments
```

---

## 🛠️ Getting Started

### 1. Backend Setup
The backend handles the logic, API, and database interactions.

- **Navigate to directory:** `cd backend`
- **Install dependencies:** `pip install -r requirements.txt`
- **Required ENV:** Configure `.env` with your PostgreSQL credentials.
- **Run the server:** `uvicorn main:app --reload`
- **API Documentation:** Visit `http://localhost:8000/docs`

#### Database Maintenance & Seeding
- **Fresh Reset:** `python reset_db.py` (Drops and recreates all tables)
- **Seed Master Data:** `python seed_all_master.py` (Populates statuses, industries, etc.)
- **Seed Test Data:** `python seed_dummy_data.py` (Populates 500+ records for testing)

---

### 2. Frontend Setup
The frontend is built with Next.js 16 and Tailwind CSS.

- **Navigate to directory:** `cd frontend`
- **Install dependencies:** `npm install`
- **Required ENV:** Configure `.env.local` to point to the backend URL.
- **Run the server:** `npm run dev`
- **Access App:** Visit `http://localhost:3000`

---

## 🏗️ Tech Stack

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database:** PostgreSQL
- **Language:** Python 3.12+

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/)
- **Styling:** Tailwind CSS
- **Components:** Radix UI / Shadcn UI
- **Data Table:** TanStack Table
- **Charts:** Recharts

---

## 📄 License
Privately developed for SantaiWorks.
