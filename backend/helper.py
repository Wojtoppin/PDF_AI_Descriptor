import fitz
import requests
import re

API_URL = "http://localhost:1234/v1/chat/completions"
MODEL = "bielik-7b-instruct-v0.1"
MAX_CHARS = 8000

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.encode("utf-8", errors="ignore").decode("utf-8")

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return clean_text(text)

def summarize_pdf(pdf_path):
    text = extract_text_from_pdf(pdf_path)[:MAX_CHARS]

    prompt = (
        "Przeanalizuj poniższy dokument i wypisz jego krótkie streszczenie w maksymalnie 2 zdaniach po Polsku. "
        "Używaj języka formalnego i jasnego. Unikaj kopiowania treści, skup się na istocie dokumentu.\n\n"
        f"DOKUMENT:\n{text}"
    )

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Jesteś profesjonalnym prawnikiem i specjalistą od streszczania dokumentów. "
                    "Twoim zadaniem jest wyciągnięcie tylko najważniejszych informacji w maksymalnie trzech zdaniach. "
                    "Nie przepisuj tekstu. Nie używaj specjalistycznego żargonu. "
                    "Stosuj krótki, jasny i konkretny język."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 300,
        "temperature": 0.2,
        "top_p": 0.8,
        "presence_penalty": 1.0,
        "frequency_penalty": 1.0
    }

    try:
        print("Sending summary request")
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        print("Received summary response")
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}


def ask_question_about_pdf(pdf_path, question):
    """Ask a legal question about the content of a PDF document."""
    raw_text = extract_text_from_pdf(pdf_path)[:MAX_CHARS]
    text = clean_text(raw_text)

    prompt = (
        f"Poniżej znajduje się treść umowy:\n{text}\n\n"
        f"Odpowiedz na pytanie dotyczące tego dokumentu:\n{question}"
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
