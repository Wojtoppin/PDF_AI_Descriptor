import { sendPdfToSummaryApi } from "../http.js";

export const htmlLoading = <div className="loader"></div>;
export async function handleSubmit(fileValue, updateDescription) {
  if (fileValue) {
    updateDescription(
      `${fileValue.lastModified}-${fileValue.name}`,
      htmlLoading
    );
    const result = await sendPdfToSummaryApi(fileValue);
    const message =
      result?.choices?.[0]?.message?.content ||
      result?.error ||
      "Brak odpowiedzi.";
    const slicedMessage = message.slice(4);
    updateDescription(
      `${fileValue.lastModified}-${fileValue.name}`,
      slicedMessage
    );
  }
}

export async function uploadFile(fileValue, updateChatId) {
  if (!fileValue) return;

  const formData = new FormData();
  formData.append("file", fileValue);

  try {
    const response = await fetch("http://127.0.0.1:8000/upload/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Błąd serwera: ${response.status}`);
    }

    const result = await response.json();
    const chatId = result.chat_id;

    if (!chatId) throw new Error("Brak chat_id w odpowiedzi");

    // Przekaż chatId do komponentu nadrzędnego, np. by zapisać go dla tego pliku
    updateChatId(chatId);
  } catch (error) {
    console.error("Błąd podczas przesyłania pliku:", error);
  }
}

export function clickHandler(tooltip) {
  if (tooltip === "Chatbot") {
    chatbotRef.current?.showModal();
  } else if (tooltip === "Edit") {
    setIsEditing((prevValue) => !prevValue);
  } else if (tooltip === "Reimagine") {
    setIsEditing(false);
    updateDescription(`${fileValue.lastModified}-${name}`, htmlLoading);
    handleSubmit(fileValue, updateDescription);
  } else if (tooltip === "Delete") {
    handleDelete("delete", {}, `${fileValue.lastModified}-${name}`);
  }
}
