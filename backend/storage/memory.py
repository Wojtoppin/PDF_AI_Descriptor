document_store = {}

def store_document(chat_id: str, text: str):
    document_store[chat_id] = text

def get_document(chat_id: str) -> str | None:
    return document_store.get(chat_id)