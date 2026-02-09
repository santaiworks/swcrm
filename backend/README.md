# Python Backend Setup

## Prerequisites
- Python 3.8+
- PostgreSQL
  - Database: `swcrm`
  - User: `postgres`
  - Password: `postgres`
  - Host: `localhost`
  - Port: `5432`

## Setup
1. Open a terminal in the `santaiworks-crm` directory.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
   (Or use `python -m pip install ...` if pip is not in path)

## Running
Run the server from the `backend` directory:
```bash
cd backend
uvicorn main:app --reload
```
OR from the root (`santaiworks-crm`) directory:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`.
The Next.js frontend has been configured to talk to this URL.

## Database Initialization
The tables will be automatically created when you start the application for the first time.
