import chatbot from "../assets/chatbot.png";
import edit from "../assets/edit.png";
import regenerate from "../assets/regenerate.png";
import deleteIMG from "../assets/delete.png";
import ModalChat from "./ModalChat";
import { useEffect, useRef, useState } from "react";
import { sendPdfToSummaryApi } from "../http.js";
import Icon from "./Icon.jsx";



const htmlLoading = <div className="loader"></div>;
const handleSubmit = async (fileValue, updateDescription) => {
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
};

const uploadFile = async (fileValue, updateChatId) => {
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

export default function ColumnRow({
  name,
  key,
  messages,
  description,
  fileValue,
  updateMessages,
  updateDescription,
  handleDelete,
}) {
  const chatbotRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [chatId, setChatId] = useState("")
  useEffect(() => {
    uploadFile(fileValue,setChatId)
    handleSubmit(fileValue,updateDescription);
  }, []);

  const clickHandler = (tooltip) => {
    if (tooltip === "Chatbot") {
      chatbotRef.current?.showModal();
    } else if (tooltip === "Edit") {
      setIsEditing((prevValue) => !prevValue);
    } else if (tooltip === "Reimagine") {
      setIsEditing(false);
      updateDescription(`${fileValue.lastModified}-${name}`, htmlLoading);
      handleSubmit(fileValue, updateDescription);
    } else if (tooltip === "Delete") {
      handleDelete("delete",{},`${fileValue.lastModified}-${name}`);
    }
  };

  return (
    <tr key={key} className="hover:bg-gray-50 transition-colors">
      <td className="border border-gray-300 px-5 py-3">{name}</td>
      <td className="border border-gray-300 px-5 py-3">
        {isEditing ? (
          <textarea
            onChange={(e) =>
              updateDescription(
                `${fileValue.lastModified}-${name}`,
                e.target.value
              )
            }
            className="w-full h-24 p-2 border border-gray-300 rounded"
            value={description}
          />
        ) : (
          <span className="w-full h-full whitespace-pre-wrap">{description}</span>
        )}
      </td>

      <td className="border border-gray-300 px-5 py-3">
        <div className="flex items-center space-x-2">
          <Icon
            src={regenerate}
            tooltip={"Reimagine"}
            clickHandler={clickHandler}
          />
          <Icon
            src={chatbot}
            tooltip={"Chatbot"}
            ref={chatbotRef}
            clickHandler={clickHandler}
          />
          <ModalChat ref={chatbotRef} messages={messages} updateMessages={updateMessages} index={`${fileValue.lastModified}-${name}`} chatId={chatId}/>
        </div>
      </td>

      <td className="border border-gray-300 px-5 py-3">
        <div className="flex items-center space-x-2">
          <Icon src={edit} tooltip={"Edit"} clickHandler={clickHandler} />

          <Icon
            src={deleteIMG}
            tooltip={"Delete"}
            clickHandler={clickHandler}
          />
        </div>
      </td>
    </tr>
  );
}
