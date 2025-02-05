import React, { useState, useEffect } from 'react';
import { Send, Video, Search } from 'lucide-react';
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import logo from "../Layout/Image/logo.jpeg";
import Sidebar from './InvestorSidebar';
import { Link, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { baseurl } from '../../Constent/regex';
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  createdAt: string;
  avatar: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  status: 'online' | 'offline';
  userId: string; // Added to track the user's ID
}

interface Entrepreneur {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  premium: any;
}

interface ChatResponse {
  _id: string;
  chatname: string;
  entrepreneur: Entrepreneur[];
  investor: any[];
  latestmessage: any[];
  relatedModel: string;
  createdAt: string;
  updatedAt: string;
}

interface MessageResponse {
  _id: string;
  sender: string;
  content: string;
  chat: string;
  createdAt: string;
}

interface OnlineUsers {
  [key: string]: boolean;
}

const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [receiver, setReceiver] = useState<Entrepreneur | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});

  const api = axios.create({
    baseURL: baseurl,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const token = useGetToken("investor");
  const email = token?.email;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const formatDateTime = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullDateTime: now.toISOString()
    };
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/investor/get-messages/${chatId}`);
      const messageHistory = response.data?.messages || response.data || [];
      
      if (Array.isArray(messageHistory)) {
        const formattedMessages: ChatMessage[] = messageHistory.map((msg: MessageResponse) => {
          const senderEmail = msg.sender || msg.sender;
          return {
            id: msg._id,
            sender: senderEmail,
            message: msg.content,
            timestamp: formatMessageTime(msg.createdAt),
            createdAt: msg.createdAt,
            avatar: "/api/placeholder/40/40"
          };
        });
        setMessages(formattedMessages);
      } else {
        console.error("Message history is not an array:", messageHistory);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const accessData = async () => {
    if (!email) {
      return;
    }

    try {
      const response = await api.post("/investor/profile", { email });
      const investor = response.data.investor.Investor;
      const senderId = investor._id;
      setCurrentUserId(senderId);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const getChat = async () => {
    try {
      const response = await api.get('/investor/get-chat');
      const chatHistory = response.data?.response || [];
      
      if (Array.isArray(chatHistory)) {
        const formattedChats: Chat[] = chatHistory.map((chat: any) => ({
          id: chat._id,
          name: chat.entrepreneur ? 
            `${chat.entrepreneur.firstname} ${chat.entrepreneur.lastname}` : 
            "Unknown User",
          lastMessage: chat.latestmessage?.[0]?.message || "No messages yet",
          timestamp: chat.latestmessage?.[0]?.createdAt 
            ? formatMessageTime(chat.latestmessage[0].createdAt)
            : formatDateTime().time,
          avatar: chat.entrepreneur.profile,
          status: 'offline',
          userId: chat.entrepreneur._id // Store the user's ID
        }));
        setChats(formattedChats);
      } else {
        console.error("Chat history is not an array:", chatHistory);
        setChats([]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    }
  };

  useEffect(() => {
    accessData();
  }, []);

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  // Socket connection and user status handling
  useEffect(() => {
    const newSocket = io("http://localhost:3009");
    setSocket(newSocket);

    // When connected, emit the user's ID
    newSocket.on('connect', () => {
      if (currentUserId) {
        newSocket.emit('user_connected', { userId: currentUserId });
      }
    });

    // Handle online users updates
    newSocket.on('online_users', (users: string[]) => {
      const onlineStatus: OnlineUsers = {};
      users.forEach(userId => {
        onlineStatus[userId] = true;
      });
      setOnlineUsers(onlineStatus);
      
      // Update chats with online status
      setChats(prevChats => 
        prevChats.map(chat => ({
          ...chat,
          status: onlineStatus[chat.userId] ? 'online' : 'offline'
        }))
      );
    });

    // Handle user disconnection
    newSocket.on('user_disconnected', (userId: string) => {
      setOnlineUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      
      // Update chat status when user disconnects
      setChats(prevChats => 
        prevChats.map(chat => ({
          ...chat,
          status: chat.userId === userId ? 'offline' : chat.status
        }))
      );
    });

    return () => {
      if (currentUserId) {
        newSocket.emit('user_disconnected', { userId: currentUserId });
      }
      newSocket.disconnect();
    };
  }, [currentUserId]);

  // Message handling
  useEffect(() => {
    if (socket) {
      socket.removeAllListeners("receive_message");
      
      socket.on("receive_message", (data: ChatMessage) => {
        if (data.sender !== email) {
          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === data.id);
            if (messageExists) return prevMessages;
            return [...prevMessages, data];
          });
          
          setChats(prevChats => 
            prevChats.map(chat => 
              chat.id === activeChat 
                ? { ...chat, lastMessage: data.message, timestamp: data.timestamp }
                : chat
            )
          );
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket, email, activeChat]);

  const handleSendMessage = async () => {
    if (message.trim() && socket && activeChat && email && !isProcessing) {
      try {
        setIsProcessing(true);
        const { time, fullDateTime } = formatDateTime();
        
        const messageData = {
          sender: currentUserId,
          email: email,
          chatId: activeChat,
          message: message.trim(),
          receiverId: receiver?._id,
          timestamp: time,
          createdAt: fullDateTime
        };

        const response = await api.post('/investor/send-message', messageData);
        
        if (response?.data) {
          const newMessage: ChatMessage = {
            id: response.data._id || Date.now().toString(),
            sender: currentUserId,
            message: message.trim(),
            timestamp: time,
            createdAt: fullDateTime,
            avatar: "/api/placeholder/40/40"
          };

          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) return prevMessages;
            return [...prevMessages, newMessage];
          });

          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === activeChat
                ? { ...chat, lastMessage: message.trim(), timestamp: time }
                : chat
            )
          );

          socket.emit("send_message", {
            ...newMessage,
            chatId: activeChat,
            receiverId: receiver?._id
          });

          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
        ]}
      />

      <div className="flex-1 flex justify-center items-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg flex w-full max-w-[1300px] h-[calc(100vh-120px)]">
          <div className="w-1/4 border-r border-gray-200">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="w-3/4 flex">
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="bg-[#1e1b4b] text-white p-4">
                <h1 className="text-2xl font-bold mb-4">Chats</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 pl-8 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e1b4b] text-gray-800"
                  />
                  <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                      activeChat === chat.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {chat.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-2/3 flex flex-col">
              {activeChat ? (
                <>
                  <div className="bg-[#1e1b4b] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={chats.find(c => c.id === activeChat)?.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                        {chats.find(c => c.id === activeChat)?.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">
                          {chats.find(c => c.id === activeChat)?.name}
                        </h3>
                        <span className={`text-sm ${
                          chats.find(c => c.id === activeChat)?.status === 'online'
                            ? 'text-green-400'
                            : 'text-gray-400'
                        }`}>
                          {chats.find(c => c.id === activeChat)?.status}
                        </span>
                      </div>
                    </div>
                    <Video className="h-6 w-6 text-white cursor-pointer" />
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => {
                      const isCurrentUser = msg.sender === currentUserId;
                      return (
                        <div
                          key={`${msg.id}-${index}`}
                          className={`flex ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-[#1e1b4b] text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <span
                              className={`text-xs ${
                                isCurrentUser ? 'text-gray-300' : 'text-gray-500'
                              } block text-right mt-1`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1e1b4b]"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-[#1e1b4b] text-white rounded-lg hover:bg-[#29256d] focus:outline-none"
                      >
                        <Send />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a chat to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;