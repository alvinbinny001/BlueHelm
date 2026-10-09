from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base
from api_routes import router as api_router
from chat_routes import router as chat_router

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")
except Exception as e:
    print(f"Warning: Could not create database tables. Error: {e}")

app = FastAPI(title="Neuronex Master Application")

# Include API routes
app.include_router(api_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

# Serve Frontend static files
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
AUTH_PAGE = os.path.join(FRONTEND_DIR, "auth.html")

if os.path.exists(FRONTEND_DIR):
    # Mount the assets directory specifically
    assets_dir = os.path.join(FRONTEND_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/auth", include_in_schema=False)
    def serve_auth_page():
        if os.path.exists(AUTH_PAGE):
            return FileResponse(AUTH_PAGE)
        raise HTTPException(status_code=404, detail="Authentication page not found")

    @app.get("/login", include_in_schema=False)
    def serve_login_page():
        if os.path.exists(AUTH_PAGE):
            return FileResponse(AUTH_PAGE)
        raise HTTPException(status_code=404, detail="Login page not found")

    # Serve index.html for all other routes to support SPA routing
    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        # Prevent API routes from being swallowed by the catchall
        if catchall == "api" or catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend build not found"}
else:
    print(f"Warning: Frontend directory not found at {FRONTEND_DIR}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
