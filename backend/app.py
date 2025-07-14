from fastapi import FastAPI, File, UploadFile, Form
import tempfile
from helper import summarize_pdf, ask_question_about_pdf
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <-- frontend origin
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



@app.post("/question/")
async def upload_and_ask_question(file: UploadFile = File(...), question: str = Form(...)):
    """Upload a PDF and ask a question about it."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    return ask_question_about_pdf(tmp_path, question)
