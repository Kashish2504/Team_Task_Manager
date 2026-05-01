import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth_routes, project_routes, task_routes, dashboard_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Team Task Manager API",
    description="REST API for managing teams, projects, and tasks",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    "http://localhost:3000", # Allow local frontend development
    "https://team-task-manager-five-sigma.vercel.app", # Allow your deployed Vercel frontend
]

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routes
app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(task_routes.project_task_router)
app.include_router(task_routes.task_router)
app.include_router(dashboard_routes.dashboard_router)
app.include_router(dashboard_routes.project_dashboard_router)


@app.get("/")
async def root():
    return {
        "message": "🚀 Team Task Manager API is running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "team-task-manager-api",
        "environment": settings.ENVIRONMENT,
    }