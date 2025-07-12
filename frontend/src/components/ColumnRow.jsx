import chatbot from "../assets/chatbot.png";
import edit from "../assets/edit.png";
import regenerate from "../assets/regenerate.png";
import deleteIMG from "../assets/delete.png";
import ModalChat from "./ModalChat";
import { useEffect, useRef, useState } from "react";
import { sendPdfToSummaryApi } from "../http.js";
import Icon from "./Icon.jsx";

export default function ColumnRow({
  name,
  description,
  fileValue,
  index,
  updateDescription,
}) {
  const chatbotRef = useRef();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleSubmit = async () => {
      console.log("Fetching summary for file:", name);
      if (fileValue) {
        console.log("wysylka");
        const result = await sendPdfToSummaryApi(fileValue);
        setSummary(() => {
          const message =
            result?.choices?.[0]?.message?.content ||
            result?.error ||
            "Brak odpowiedzi.";
          return message.slice(4);
        });
      }
    };

    handleSubmit();
  }, []);
  
  const clickHandler = (tooltip) => {
    if (tooltip === "Chatbot") {
      chatbotRef.current?.showModal();
    } else if (tooltip === "Edit") {
      setIsEditing((prevValue) => !prevValue);
    } else if (tooltip === "reimagine") {
      setIsEditing((prevValue) => !prevValue);
    } else if (tooltip === "delete") {
      console.log("Delete action triggered for:", name);
    }
  }

  return (
    <tr key={index} className="hover:bg-gray-50 transition-colors">
      <td className="border border-gray-300 px-5 py-3">{name}</td>
      <td className="border border-gray-300 px-5 py-3">
        {isEditing ? (
          <textarea onChange={(e)=>updateDescription(`${fileValue.lastModified}-${name}`,e.target.value)} className="w-full h-full" value={description}/>
        ) : (
          <span className="w-full h-full">{description}</span>
        )}
      </td>

      <td className="border border-gray-300 px-5 py-3">
        <div className="flex items-center space-x-2">
          <Icon
            src={edit}
            tooltip={"Edit"}
            clickHandler={clickHandler}
          />

          <Icon
            src={deleteIMG}
            tooltip={"delete"}
            clickHandler={clickHandler}
          />
        </div>
      </td>

      <td className="border border-gray-300 px-5 py-3">
        <div className="flex items-center space-x-2">
          <Icon
            src={regenerate}
            tooltip={"reimagine"}
            clickHandler={clickHandler}
          />
          <Icon
            src={chatbot}
            tooltip={"Chatbot"}
            ref={chatbotRef}
            clickHandler={clickHandler}
          />
          <ModalChat ref={chatbotRef} file={fileValue} />
        </div>
      </td>
    </tr>
  );
}
