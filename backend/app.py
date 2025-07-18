from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import uuid
from helper import extract_text_from_pdf, summarize_pdf
from storage.memory import store_document, get_document
import requests

API_URL = "http://localhost:1234/v1/chat/completions"
MODEL = "bielik-7b-instruct-v0.1"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summary/")
async def upload_and_summarize(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        result = summarize_pdf(tmp_path)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    text = extract_text_from_pdf(tmp_path)
    chat_id = str(uuid.uuid4())
    store_document(chat_id, text)
    return {"chat_id": chat_id}

@app.post("/ask/")
async def ask_question(chat_id: str = Form(...), question: str = Form(...)):
    text = get_document(chat_id)
    if not text:
        return {"error": "Nie znaleziono dokumentu o podanym ID."}

    prompt = (
    f"Poniżej znajduje się treść dokumentu:\n{text[:6000]}\n\n"
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
        return {"error": str(e)}