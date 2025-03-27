import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define types for our chat messages
interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  apiKey: string;
  modelName?: string;
  initialMessage?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  apiKey, 
  modelName = 'gemini-1.5-pro', 
  initialMessage = 'Hello! How can I help you today?' 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the Gemini AI client
  const genAI = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    // Add initial bot message when component mounts
    if (messages.length === 0) {
      setMessages([
        { role: 'bot', content: initialMessage, timestamp: new Date() }
      ]);
    }
  }, [initialMessage, messages.length]);

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
  
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
  
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
  
    try {
      // Ensure the correct model is used
      const model = genAI.getGenerativeModel({ model: modelName });
  
      console.log('Sending request to Gemini API:', { model: modelName, content: inputValue });
  
      // Use generateContentStream for better streaming support
      const result = await model.generateContentStream(inputValue);
      
      console.log('Received response from Gemini API:', result);
      
      const response = await result.response;
      const text = response.text();
  
      const botMessage: ChatMessage = {
        role: 'bot',
        content: text,
        timestamp: new Date()
      };
  
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      setMessages(prevMessages => [...prevMessages, { role: 'bot', content: errorMessage, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        aria-label="Chat with Pitchbot"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
             style={{ height: '500px' }}>
          {/* Chat header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">PitchBot</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none max-w-xs md:max-w-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Chat input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:bg-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;