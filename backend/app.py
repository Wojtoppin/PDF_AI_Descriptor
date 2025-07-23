from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import tempfile
import uuid
import os
import sys
import webbrowser
import threading
import time
import requests
import uvicorn

from helper import extract_text_from_pdf, summarize_pdf
from storage.memory import store_document, get_document

# === Config ===
API_URL = "http://localhost:1234/v1/chat/completions"
MODEL = "bielik-7b-instruct-v0.1"

# === Handle PyInstaller Paths ===
def get_base_path():
    if getattr(sys, 'frozen', False):  # PyInstaller bundle
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

BASE_PATH = get_base_path()


# === FastAPI App Setup ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === API Routes - DEFINE THESE FIRST! ===

@app.post("/summary/")
async def upload_and_summarize(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        result = summarize_pdf(tmp_path)
        os.unlink(tmp_path)
        return result
    except Exception as e:
        print(f"Error in /summary: {e}", file=sys.stderr)
        return {"error": str(e)}

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        text = extract_text_from_pdf(tmp_path)
        chat_id = str(uuid.uuid4())
        store_document(chat_id, text)
        return {"chat_id": chat_id}
    except Exception as e:
        print(f"Error in /upload: {e}", file=sys.stderr)
        return {"error": str(e)}
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.post("/ask/")
async def ask_question(chat_id: str = Form(...), question: str = Form(...)):
    text = get_document(chat_id)
    if not text:
        return {"error": "Nie znaleziono dokumentu o podanym ID."}

    prompt = (
        f"Poniżej znajduje się treść dokumentu:\n{text[:8000]}\n\n"
        f"Odpowiedz na pytanie w jak najkrótszy sposób, maksymalnie 2 zdania. Pytanie:\n{question}"
    )

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "Jesteś asystentem prawnym analizującym dokumenty."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }

    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error in /ask: {e}", file=sys.stderr)
        return {"error": str(e)}


# === Serve Static Files (React App) - DEFINE THESE LAST! ===
static_dir = os.path.join(BASE_PATH, "frontend", "dist")

# Mount assets separately first
app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

# Then, mount the root static files, ensuring html=True handles the SPA routing
# This acts as a catch-all for any routes not handled by your API
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static_root")


# === Auto-open Browser ===
def open_browser():
    time.sleep(3)
    webbrowser.open("http://localhost:8000")


# === Main execution block to run Uvicorn server ===
if __name__ == "__main__":
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info", log_config=None)