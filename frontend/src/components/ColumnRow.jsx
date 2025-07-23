import chatbot from "../assets/chatbot.png";
import edit from "../assets/edit.png";
import regenerate from "../assets/regenerate.png";
import deleteIMG from "../assets/delete.png";
import ModalChat from "./ModalChat";
import { useEffect, useRef, useState } from "react";
import { uploadFile, handleSubmit, htmlLoading } from "./ColumnRowFunctions.jsx";
import Icon from "./Icon.jsx";

export default function ColumnRow({
  name,
  messages,
  description,
  fileValue,
  updateMessages,
  updateDescription,
  handleDelete,
}) {
  const chatbotRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [chatId, setChatId] = useState("");
  useEffect(() => {
    uploadFile(fileValue, setChatId);
    handleSubmit(fileValue, updateDescription);
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
      handleDelete("delete", {}, `${fileValue.lastModified}-${name}`);
    }
  };

  return (
    <tr key={`${fileValue.lastModified}-${name}`} className="hover:bg-gray-50 transition-colors">
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
          <span className="w-full h-full whitespace-pre-wrap">
            {description}
          </span>
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
          <ModalChat
            ref={chatbotRef}
            messages={messages}
            updateMessages={updateMessages}
            index={`${fileValue.lastModified}-${name}`}
            chatId={chatId}
          />
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
