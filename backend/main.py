from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.core import config, database

# Import routers and models from modules
from app.modules.leads import router as leads_router
from app.modules.master_data import router as master_data_router
from app.modules.auth import router as auth_router
from app.modules.activities import router as activities_router
from app.modules.organizations import router as organizations_router
from app.modules.notes import router as notes_router
from app.modules.employees import router as employees_router
from app.modules.tasks import router as tasks_router
from app.modules.calls import router as calls_router
from app.modules.attachments import router as attachments_router
from app.modules.emails import router as emails_router
from app.modules.contacts import router as contacts_router
from app.modules.settings import router as settings_router



# Initialize App
app = FastAPI(title=config.settings.PROJECT_NAME, version=config.settings.PROJECT_VERSION)

@app.on_event("startup")
def init_db():
    database.Base.metadata.create_all(bind=database.engine)
    try:
        app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
    except Exception:
        pass
    try:
        from sqlalchemy import text
        with database.engine.connect() as conn:
            conn.execution_options(isolation_level="AUTOCOMMIT")
            conn.execute(text("ALTER TABLE attachments ADD COLUMN IF NOT EXISTS description TEXT;"))
            conn.execute(text("ALTER TABLE calls ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;"))
            conn.execute(text("ALTER TABLE calls ADD COLUMN IF NOT EXISTS call_type TEXT;"))
            conn.execute(text("ALTER TABLE calls ADD COLUMN IF NOT EXISTS to_contact TEXT;"))
            conn.execute(text("ALTER TABLE calls ADD COLUMN IF NOT EXISTS from_contact TEXT;"))
            conn.execute(text("ALTER TABLE calls ADD COLUMN IF NOT EXISTS received_by TEXT;"))
            conn.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status_id INTEGER;"))
            conn.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority_id INTEGER;"))
    except Exception:
        pass

# CORS Metadata
if config.settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in config.settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Include Routers
app.include_router(master_data_router.router, prefix="/master-data", tags=["Master Data"])
app.include_router(leads_router.router, prefix="/leads", tags=["Leads"])
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(activities_router.router, prefix="/activities", tags=["Activities"])
app.include_router(organizations_router.router, prefix="/organizations", tags=["Organizations"])
app.include_router(notes_router.router, prefix="/notes", tags=["Notes"])
app.include_router(employees_router.router, prefix="/employees", tags=["Employees"])
app.include_router(tasks_router.router, prefix="/tasks", tags=["Tasks"])
app.include_router(calls_router.router, prefix="/calls", tags=["Calls"])
app.include_router(attachments_router.router, prefix="/attachments", tags=["Attachments"])
app.include_router(emails_router.router, prefix="/emails", tags=["Emails"])
app.include_router(contacts_router.router, prefix="/contacts", tags=["Contacts"])
app.include_router(settings_router.router, prefix="/settings", tags=["Settings"])

