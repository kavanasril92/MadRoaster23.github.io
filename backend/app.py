from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pathlib import Path

app = FastAPI()

PROJECT_DIR = Path(__file__).resolve().parent
# PROJECT_DIR = Path.cwd()
BACKEND_DIR = PROJECT_DIR.parent
FRONTEND_DIR = BACKEND_DIR / "frontend"
INDEX_FILE = FRONTEND_DIR / "index.html"

print("CWD:", Path.cwd())
print("PROJECT_ROOT:", PROJECT_DIR)
print("BACKEND_DIR:", BACKEND_DIR)
print("FRONTEND_DIR:", FRONTEND_DIR)
print("FRONTEND_DIR exists:", FRONTEND_DIR.exists())
print("INDEX_FILE:", INDEX_FILE)
print("INDEX_FILE exists:", INDEX_FILE.exists())

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

# Serve frontend assets (css, js, images)
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
    app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
    app.mount("/var", StaticFiles(directory=FRONTEND_DIR / "var"), name="var")
    app.mount("/Custom", StaticFiles(directory=FRONTEND_DIR / "Custom"), name="Custom")

# Root → index.html
@app.get("/")
def read_index():
    if not INDEX_FILE.exists():
        return HTMLResponse("Frontend not found", status_code=404)

    return FileResponse(INDEX_FILE)

    # return FileResponse(FRONTEND_DIR / "index.html")


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # tighten later
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/api/health")
# def health():
#     return {"status": "ok"}
