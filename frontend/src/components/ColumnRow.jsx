import chatbot from "../assets/chatbot.png";
import edit from "../assets/edit.png";
import regenerate from "../assets/regenerate.png";
import ModalChat from "./ModalChat";
import { useRef, useState } from "react";

export default function ColumnRow({name, description, fileValue, index}) {
    const chatbotRef = useRef();
    const [isEditing, setIsEditing] = useState(false);

    return <tr key={index} className="hover:bg-gray-50 transition-colors">
            <td className="border border-gray-300 px-5 py-3">{name}</td>
            <td className="border border-gray-300 px-5 py-3">{isEditing?<textarea className="w-full h-full">{description}</textarea>:<span className="w-full h-full">{description}</span>}</td>
            <td className="border border-gray-300 px-5 py-3">
              <div className="flex items-center space-x-6">
                {/* Regenerate Icon */}
                <div className="relative group flex flex-col items-center">
                  <img
                    src={regenerate}
                    alt="Reimagine"
                    style={{ flexShrink: 0 }}
                    className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                  />
                  <span className="absolute bottom-[-1.5rem] text-xs text-gray-600 bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    Reimagine
                  </span>
                </div>

                {/* Edit Icon */}
                <div className="relative group flex flex-col items-center">
                  <img
                    src={edit}
                    alt="Edit"
                    onClick={() => setIsEditing((prevValue) => !prevValue)}
                    style={{ flexShrink: 0 }}
                    className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                  />
                  <span className="absolute bottom-[-1.5rem] text-xs text-gray-600 bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    Edit
                  </span>
                </div>

                {/* Chatbot Icon */}
                <div className="relative group flex flex-col items-center">
                  <img
                    onClick={() => chatbotRef.current?.showModal()}
                    src={chatbot}
                    alt="Chatbot"
                    style={{ flexShrink: 0 }}
                    className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                  />
                  <ModalChat ref={chatbotRef} file={fileValue} />
                  <span className="absolute bottom-[-1.5rem] text-xs text-gray-600 bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    Chatbot
                  </span>
                </div>
              </div>
            </td>
          </tr>


}