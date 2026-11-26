
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="KnowBase API",
    description="AI Document Intelligence and Enterprise Knowledge Assistant",
    version="1.0.0"
)

# Allow the frontend development server to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Temporary workspace data.
# We will move this information into PostgreSQL later.
WORKSPACES = [
    {
        "id": 1,
        "name": "HR Workspace",
        "category": "Human Resources",
        "description": "Employee policies and HR guidelines",
        "icon": "♙"
    },
    {
        "id": 2,
        "name": "Technical Documentation",
        "category": "Engineering",
        "description": "Technical manuals and API documentation",
        "icon": "⌘"
    },
    {
        "id": 3,
        "name": "Finance Workspace",
        "category": "Finance",
        "description": "Financial reports and budgets",
        "icon": "₹"
    },
    {
        "id": 4,
        "name": "General Company",
        "category": "All Departments",
        "description": "Shared organizational knowledge",
        "icon": "▤"
    }
]


@app.get("/")
def home():
    return {
        "message": "Welcome to KnowBase API",
        "status": "running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "KnowBase"
    }


@app.get("/api/workspaces")
def get_workspaces():
    return {
        "total": len(WORKSPACES),
        "workspaces": WORKSPACES
    }


@app.get("/api/workspaces/{workspace_id}")
def get_workspace(workspace_id: int):
    for workspace in WORKSPACES:
        if workspace["id"] == workspace_id:
            return workspace

    return {
        "error": "Workspace not found"
    }
