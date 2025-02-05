import React, { useState } from "react";
import Chatbot from "../Common/Chatbot"
const ChatbotIcon: React.FC = () => {
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div>
      {/* Floating icon button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full shadow-lg focus:outline-none"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Conditionally render Chatbot component */}
      {showChatbot && <Chatbot />}
    </div>
  );
};

export default ChatbotIcon;
