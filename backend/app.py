from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

# Serve frontend assets (css, js, images)
app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
app.mount("/var", StaticFiles(directory=FRONTEND_DIR / "var"), name="var")
app.mount("/Custom", StaticFiles(directory=FRONTEND_DIR / "Custom"), name="Custom")

# Root → index.html
@app.get("/")
def read_index():
    return FileResponse(FRONTEND_DIR / "index.html")


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # tighten later
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/api/health")
# def health():
#     return {"status": "ok"}
