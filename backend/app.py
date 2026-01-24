from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pathlib import Path
import os
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

env_var = os.getenv("ENV")

print(os.getenv("ENV"))

PROJECT_ENV = os.getenv("ENV")
## Default path to Koyeb Environment
PROJECT_DIR = Path(__file__).resolve().parent
if PROJECT_ENV == 'local':
    PROJECT_DIR = Path(__file__).resolve().parent.parent
elif PROJECT_ENV == 'koyeb.production':
    PROJECT_DIR = Path(__file__).resolve().parent
    

# PROJECT_DIR = Path(__file__).resolve().parent.parent if env_var == 'local' else Path(__file__).resolve().parent
# PROJECT_DIR = Path.cwd()
BACKEND_DIR = PROJECT_DIR.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
INDEX_FILE = FRONTEND_DIR / "index.html"
FRONTEND_DIR_ASSETS = FRONTEND_DIR / "assets"
FRONTEND_DIR_JS = FRONTEND_DIR / "js"
FRONTEND_DIR_VAR = FRONTEND_DIR / "var"
FRONTEND_DIR_CUSTOM = FRONTEND_DIR / "Custom"

print("CWD:", Path.cwd())
print("PROJECT_ROOT:", PROJECT_DIR)
print("BACKEND_DIR:", BACKEND_DIR)
print("FRONTEND_DIR:", FRONTEND_DIR)
print("FRONTEND_DIR exists:", FRONTEND_DIR.exists())
print("INDEX_FILE:", INDEX_FILE)
print("INDEX_FILE exists:", INDEX_FILE.exists())
print("FRONTEND_DIR_ASSETS:", FRONTEND_DIR_ASSETS)
print("FRONTEND_DIR_ASSETS exists:", FRONTEND_DIR_ASSETS.exists())
print("FRONTEND_DIR_JS:", FRONTEND_DIR_JS)
print("FRONTEND_DIR_JS exists:", FRONTEND_DIR_JS.exists())
print("FRONTEND_DIR_VAR:", FRONTEND_DIR_VAR)
print("FRONTEND_DIR_VAR exists:", FRONTEND_DIR_VAR.exists())
print("FRONTEND_DIR_VAR /dist/js exists:", (FRONTEND_DIR_VAR / "dist/js").exists())
print("FRONTEND_DIR_CUSTOM:", FRONTEND_DIR_CUSTOM)
print("FRONTEND_DIR_CUSTOM exists:", FRONTEND_DIR_CUSTOM.exists())

# BASE_DIR = Path(__file__).resolve().parent.parent
# FRONTEND_DIR = BASE_DIR / "frontend"

# Serve frontend assets (css, js, images)
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR_ASSETS), name="assets")
    # app.mount("/js", StaticFiles(directory=FRONTEND_DIR_JS), name="js")
    app.mount("/var", StaticFiles(directory=FRONTEND_DIR_VAR), name="var")
    app.mount("/Custom", StaticFiles(directory=FRONTEND_DIR_CUSTOM), name="Custom")

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
