import { forwardRef, useState } from "react";
import { askQuestion } from "../http.js";

const ModalChat = forwardRef(({ chatId, file, updateMessages, index, messages}, ref) => {

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    updateMessages(index,{ sender: "user", text: userMessage });
    setInput("");
    setLoading(true);

    try {
      const response = await askQuestion(chatId, userMessage);
      const aiResponse = response?.choices?.[0]?.message?.content.slice(4) || "Brak odpowiedzi od AI.";
      updateMessages(index,{ sender: "ai", text: aiResponse });
    } catch (err) {
      updateMessages(index,{ sender: "ai", text: "Wystąpił błąd po stronie serwera." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={ref}
      className="w-full max-w-2xl rounded-lg shadow-lg border border-gray-300 overflow-hidden m-auto"
    >
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <h2 className="text-lg font-semibold">
          {file?.name || "AI Chat Assistant"}
          <button
            onClick={() => ref.current?.close()}
            className="text-white text-xl font-bold hover:text-gray-200 transition float-end"
            aria-label="Close chat"
          >
            ×
          </button>
        </h2>
      </div>

      {/* Chat Area */}
      <div className="h-96 overflow-y-auto px-6 py-4 space-y-4 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500">AI pisze odpowiedź...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center gap-2">
        <input
          type="text"
          placeholder="Zadaj pytanie dotyczące dokumentu..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Wyślij
        </button>
      </div>
    </dialog>
  );
});

export default ModalChat;