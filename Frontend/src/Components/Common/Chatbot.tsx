import React, { useState, ChangeEvent, KeyboardEvent } from "react";

interface Message {
  user: "bot" | "user";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { user: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState<string>("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessages: Message[] = [...messages, { user: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate bot response (you can integrate actual AI logic here)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { user: "bot", text: "I am an AI bot. How can I assist you?" },
      ]);
    }, 1000);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={message.user === "bot" ? "bot-message" : "user-message"}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleChangeInput}
        onKeyPress={handleKeyPress}
        placeholder="Type your message"
        className="chat-input"
      />
      <button onClick={handleSendMessage} className="send-button">
        Send
      </button>
    </div>
  );
};

export default Chatbot;
