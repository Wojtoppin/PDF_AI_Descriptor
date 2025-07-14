import chatbot from "../assets/chatbot.png";
import edit from "../assets/edit.png";
import regenerate from "../assets/regenerate.png";
import deleteIMG from "../assets/delete.png";
import ModalChat from "./ModalChat";
import { useEffect, useRef, useState } from "react";
import { sendPdfToSummaryApi } from "../http.js";
import Icon from "./Icon.jsx";

const handleSubmit = async (fileValue, updateDescription) => {
  console.log("Fetching summary for file:", fileValue.name);

  // if (fileValue) {
  //   const result = await sendPdfToSummaryApi(fileValue);
  //   const message =
  //     result?.choices?.[0]?.message?.content ||
  //     result?.error ||
  //     "Brak odpowiedzi.";
  //   const slicedMessage = message.slice(4);
  //   updateDescription(
  //     `${fileValue.lastModified}-${fileValue.name}`,
  //     slicedMessage
  //   );
  //   console.log("Summary received:", slicedMessage);
  // }
};

export default function ColumnRow({
  name,
  description,
  fileValue,
  index,
  updateDescription,
  handleDelete,
}) {
  const chatbotRef = useRef();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    handleSubmit(fileValue,updateDescription);
  }, []);

  const clickHandler = (tooltip) => {
    if (tooltip === "Chatbot") {
      chatbotRef.current?.showModal();
    } else if (tooltip === "Edit") {
      setIsEditing((prevValue) => !prevValue);
    } else if (tooltip === "Reimagine") {
      updateDescription(`${fileValue.lastModified}-${name}`, "Generating new description...");
      handleSubmit(fileValue, updateDescription);
    } else if (tooltip === "Delete") {
      handleDelete("Delete", name);
    }
  };

  return (
    <tr key={index} className="hover:bg-gray-50 transition-colors">
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
            className="w-full h-fit"
            value={description}
          />
        ) : (
          <span className="w-full h-full">{description}</span>
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
          <ModalChat ref={chatbotRef} file={fileValue} />
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
