import React, { useState, useEffect } from 'react';
import { Send, Video, Search } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import logo from "../Layout/Image/logo.jpeg";
import Sidebar from './EntrepreneurSidebar';
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import { useGetToken } from '../../token/Gettoken';
import { Link, useParams } from 'react-router-dom';

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
  status: string;
  receiverId: string;
}

interface Investor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface ChatResponse {
  _id: string;
  chatname: string;
  entrepreneur: any[];
  investor: Investor[];
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
  reciever?: string;
  isRead?: boolean;
}

const EntrepreneurChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState<Investor | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { id } = useParams();

  const token = useGetToken("entrepreneur");
  const email = token?.email;

  const api = axios.create({
    baseURL: baseurl,
    headers: { 'Content-Type': 'application/json' }
  });

  const accessData = async () => {
    if (!email) {
      return;
    }

    try {
      const response = await api.post("/entrepreneur/profile", { email });
      const senderId = response.data.entrepreneur._id;
      console.log("Current User ID:", senderId);
      setCurrentUserId(senderId);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const formatDateTime = (dateString?: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullDateTime: date.toISOString()
    };
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/entrepreneur/get-messages/${chatId}`);
      console.log("Fetched messages:", response.data);
      const messageHistory = response.data?.messages || response.data || [];
      
      if (Array.isArray(messageHistory)) {
        const formattedMessages: ChatMessage[] = messageHistory.map((msg: MessageResponse) => {
          console.log("Processing message:", msg);
          return {
            id: msg._id,
            sender: msg.sender,
            message: msg.content,
            timestamp: formatMessageTime(msg.createdAt),
            createdAt: msg.createdAt,
            avatar: "/api/placeholder/40/40"
          };
        });
        console.log("Formatted messages:", formattedMessages);
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

  const getUser = async () => {
    if (!id) return;
    
    try {
      const response = await api.get(`/entrepreneur/get-receiver/${id}`);
      const chatData: ChatResponse = response.data;
      
      if (chatData?.investor && chatData.investor.length > 0) {
        const investorData = chatData.investor[0];
        setReceiver(investorData);
        
        setChats(prevChats => {
          const existingChat = prevChats.find(chat => chat.id === investorData._id);
          if (!existingChat) {
            const { time } = formatDateTime();
            const newChat: Chat = {
              id: investorData._id,
              name: `${investorData.firstname} ${investorData.lastname}`,
              lastMessage: chatData.latestmessage?.[0]?.message || "Start a conversation...",
              timestamp: chatData.latestmessage?.[0]?.createdAt 
                ? formatMessageTime(chatData.latestmessage[0].createdAt)
                : time,
              avatar: "/api/placeholder/40/40",
              status: "online",
              receiverId: investorData._id
            };
            return [...prevChats, newChat];
          }
          return prevChats;
        });
        
        setActiveChat(investorData._id);
        if (investorData._id) {
          fetchMessages(investorData._id);
        }
      }
    } catch (error) {
      console.error("Error fetching receiver:", error);
    }
  };

  const getChat = async () => {
    if (!email) return;
    
    try {
      const response = await api.get(`/entrepreneur/get-chat/${email}`);
      const chatData = response.data;

      if (!Array.isArray(chatData)) return;

      const formattedChats = chatData.map(chat => {
        const investor = chat.investor;
        if (!investor) return null;

        const latestMessage = chat.latestmessage?.[0];
        const messageTime = latestMessage?.createdAt 
          ? formatDateTime(latestMessage.createdAt).time
          : formatDateTime().time;
 
        return {
          id: chat._id,
          name: `${investor.firstname} ${investor.lastname}`,
          lastMessage: latestMessage?.message,
          timestamp: messageTime,
          avatar: investor,
          status: "online",
          receiverId: investor._id
        };
      }).filter(Boolean) as Chat[];

      setChats(formattedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    accessData();
  }, [email]);

  useEffect(() => {
    getUser();
    getChat();
  }, [id, email]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  useEffect(() => {
    const newSocket = io("http://localhost:3009");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data: ChatMessage) => {
        console.log("Received message:", data);
        setMessages(prevMessages => [...prevMessages, data]);
        
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === activeChat 
              ? { ...chat, lastMessage: data.message, timestamp: data.timestamp }
              : chat
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket, activeChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || !email || !currentUserId) return;

    const currentChat = chats.find(chat => chat.id === activeChat);
    if (!currentChat) return;

    const { time, fullDateTime } = formatDateTime();
    
    const messageData = {
      sender: currentUserId,
      email: email,
      chatId: activeChat,
      message: message.trim(),
      receiverId: currentChat.receiverId,
      timestamp: time,
      createdAt: fullDateTime
    };

    try {
      const response = await api.post('/entrepreneur/send-message', messageData);
      if (response?.data) {
        const newMessage: ChatMessage = {
          id: response.data._id || Date.now().toString(),
          sender: currentUserId,
          message: message.trim(),
          timestamp: time,
          createdAt: fullDateTime,
          avatar: "/api/placeholder/40/40"
        };

        socket?.emit("send_message", {
          ...newMessage,
          chatId: activeChat,
          receiverId: currentChat.receiverId
        });

        setChats(prev => 
          prev.map(chat =>
            chat.id === activeChat
              ? { ...chat, lastMessage: message.trim(), timestamp: time }
              : chat
          )
        );
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-10 h-10 rounded-full"
                    />
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
                      <img
                        src={chats.find(c => c.id === activeChat)?.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className="font-semibold">
                          {chats.find(c => c.id === activeChat)?.name}
                        </h3>
                        <span className="text-sm text-green-400">online</span>
                      </div>
                    </div>
                    <Video className="h-6 w-6 text-white cursor-pointer" />
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                      const isCurrentUser = msg.sender === currentUserId;
                      console.log("Message sender:", msg.sender, "CurrentUserId:", currentUserId, "IsCurrentUser:", isCurrentUser);
                      return (
                        <div
                          key={msg.id}
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

export default EntrepreneurChat;