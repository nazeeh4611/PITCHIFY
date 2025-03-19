import React, { createContext, useContext, ReactNode } from 'react';
import ChatBot from './Chatbot';

interface ChatBotContextType {
  // Add any methods or state you want to expose
  toggleChatBot: () => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

interface ChatBotProviderProps {
  children: ReactNode;
  apiKey: string;
}

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({ children, apiKey }) => {
  // This could be expanded to include more functionality
  const toggleChatBot = () => {
    // Implementation depends on your needs
    console.log('Toggle chat bot');
  };

  return (
    <ChatBotContext.Provider value={{ toggleChatBot }}>
      {children}
      <ChatBot apiKey={apiKey} />
    </ChatBotContext.Provider>
  );
};

export const useChatBot = (): ChatBotContextType => {
  const context = useContext(ChatBotContext);
  if (context === undefined) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};