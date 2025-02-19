import React, { useState, useEffect } from 'react';
import { Send, Video, Search, ExternalLink } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { baseurl } from '../../Constent/regex';
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import Sidebar from './EntrepreneurSidebar';
import shortlogo from "../Layout/Image/shortlogo.png";
import logo from "../Layout/Image/logo.jpeg";

interface MessageResponse {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface ChatResponse {
  investor: Investor[];
  latestmessage?: { message: string; createdAt: string }[];
}

interface Investor {
  _id: string;
  firstname: string;
  lastname: string;
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

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  createdAt: string;
  avatar: string;
  isVideoCall?: boolean;
  videoLink?: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { id } = useParams();
  const token = useGetToken("entrepreneur");
  const email = token?.email;
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: baseurl,
    headers: { 'Content-Type': 'application/json' }
  });

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

  const handleVideoCall = () => {
    if (!activeChat) return;
    const roomId = `${activeChat}-${uuidv4()}`;
    const roomLink = `/investor/video-call/${roomId}`;
    const loc = `/entrepreneur/video-call/${roomId}`;
    
    // Send video call message with improved formatting
    handleSendVideoMessage(roomLink);
    
    // Navigate to the video call page
    navigate(loc);
  };

  const handleJoinVideoCall = (videoLink: string) => {
    if (!videoLink) return;
    
    // Extract the room ID from the video link
    const linkMatch = videoLink.match(/\/video-call\/([^"'\s]+)/);
    if (linkMatch && linkMatch[1]) {
      navigate(`/entrepreneur/video-call/${linkMatch[1]}`);
    }
  };

  const handleSendVideoMessage = async (link: string) => {
    if (!activeChat || !email || !currentUserId || isProcessing) return;

    const currentChat = chats.find(chat => chat.id === activeChat);
    if (!currentChat) return;

    setIsProcessing(true);
    const { time, fullDateTime } = formatDateTime();
    
    // The actual message with hidden link that gets stored in the database
    const meetingMessage = `I've started a video call. Join using this link: ${window.location.origin}${link}`;
    
    const messageData = {
      sender: currentUserId,
      email: email,
      chatId: activeChat,
      message: meetingMessage,
      receiverId: currentChat.receiverId,
      timestamp: time,
      createdAt: fullDateTime
    };

    try {
      const response = await api.post('/entrepreneur/send-message', messageData);
      if (response?.data) {
        // Create a formatted message with video call flag for the UI
        const newMessage: ChatMessage = {
          id: response.data._id,
          sender: currentUserId,
          message: "Video Call",
          timestamp: time,
          createdAt: fullDateTime,
          avatar: "/api/placeholder/40/40",
          isVideoCall: true,
          videoLink: window.location.origin + link
        };

        setMessages(prev => [...prev, newMessage]);
        setChats(prev => 
          prev.map(chat =>
            chat.id === activeChat
              ? { ...chat, lastMessage: "Video Call", timestamp: time }
              : chat
          )
        );

        socket?.emit("send_message", {
          ...messageData,
          id: response.data._id,
          chatId: activeChat,
          receiverId: currentChat.receiverId
        });
      }
    } catch (error) {
      console.error("Error sending meeting link:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || !email || !currentUserId || isProcessing) return;

    const currentChat = chats.find(chat => chat.id === activeChat);
    if (!currentChat) return;

    setIsProcessing(true);
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
          id: response.data._id,
          sender: currentUserId,
          message: message.trim(),
          timestamp: time,
          createdAt: fullDateTime,
          avatar: "/api/placeholder/40/40"
        };

        setMessages(prev => [...prev, newMessage]);
        setChats(prev => 
          prev.map(chat =>
            chat.id === activeChat
              ? { ...chat, lastMessage: message.trim(), timestamp: time }
              : chat
          )
        );

        socket?.emit("send_message", {
          ...newMessage,
          chatId: activeChat,
          receiverId: currentChat.receiverId
        });

        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/entrepreneur/get-messages/${chatId}`);
      const messageHistory = response.data?.messages || response.data || [];
      
      if (Array.isArray(messageHistory)) {
        const formattedMessages: ChatMessage[] = messageHistory.map((msg: MessageResponse) => {
          // Check if this is a video call message
          const isVideoCall = msg.content.includes('video call');
          let videoLink = '';
          
          if (isVideoCall) {
            const linkMatch = msg.content.match(/Join using this link: (.+)/);
            videoLink = linkMatch ? linkMatch[1] : '';
            
            return {
              id: msg._id,
              sender: msg.sender,
              message: "Video Call",
              timestamp: formatMessageTime(msg.createdAt),
              createdAt: msg.createdAt,
              avatar: "/api/placeholder/40/40",
              isVideoCall: true,
              videoLink: videoLink
            };
          }
          
          return {
            id: msg._id,
            sender: msg.sender,
            message: msg.content,
            timestamp: formatMessageTime(msg.createdAt),
            createdAt: msg.createdAt,
            avatar: "/api/placeholder/40/40"
          };
        });
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const accessData = async () => {
    if (!email) return;

    try {
      const response = await api.post("/entrepreneur/profile", { email });
      setCurrentUserId(response.data.entrepreneur._id);
    } catch (error) {
      console.error("Error fetching profile data:", error);
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
            return [...prevChats, {
              id: investorData._id,
              name: `${investorData.firstname} ${investorData.lastname}`,
              lastMessage: chatData.latestmessage?.[0]?.message || "Start a conversation...",
              timestamp: chatData.latestmessage?.[0]?.createdAt 
                ? formatMessageTime(chatData.latestmessage[0].createdAt)
                : time,
              avatar: "/api/placeholder/40/40",
              status: "online",
              receiverId: investorData._id
            }];
          }
          return prevChats;
        });
        
        setActiveChat(investorData._id);
        await fetchMessages(investorData._id);
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
          lastMessage: latestMessage?.message?.includes('video call') 
            ? "Video Call" 
            : (latestMessage?.message || "Start a conversation..."),
          timestamp: messageTime,
          avatar: "/api/placeholder/40/40",
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
      socket.on("receive_message", (data: any) => {
        if (data.sender !== currentUserId) {
          // Check if this is a video call message
          if (data.message && data.message.includes('video call')) {
            const linkMatch = data.message.match(/Join using this link: (.+)/);
            const videoLink = linkMatch ? linkMatch[1] : '';
            
            // Create formatted message with video call flag
            const videoCallMessage: ChatMessage = {
              id: data.id || Date.now().toString(),
              sender: data.sender,
              message: "Video Call",
              timestamp: data.timestamp || formatDateTime().time,
              createdAt: data.createdAt || new Date().toISOString(),
              avatar: "/api/placeholder/40/40",
              isVideoCall: true,
              videoLink: videoLink
            };
            
            setMessages(prev => [...prev, videoCallMessage]);
            
            // Popup for incoming video call
            if (window.confirm('You received a video call invitation. Would you like to join?')) {
              handleJoinVideoCall(videoLink);
            }
          } else {
            // Regular message handling
            setMessages(prev => [...prev, data]);
          }
          
          setChats(prev => 
            prev.map(chat => 
              chat.id === activeChat 
                ? { 
                    ...chat, 
                    lastMessage: data.message?.includes('video call') 
                      ? "Video Call" 
                      : data.message,
                    timestamp: data.timestamp 
                  }
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
  }, [socket, activeChat, currentUserId]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1e1b4b] text-gray-800"
                  />
                  <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
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
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage === "Video Call" || chat.lastMessage.includes("video call") ? (
                          <span className="flex items-center">
                            <Video className="h-3 w-3 mr-1" /> Video Call
                          </span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>
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
                    <div className="flex items-center space-x-4">
                      <Video 
                        className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition-colors" 
                        onClick={handleVideoCall}
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => {
                      const isCurrentUser = msg.sender === currentUserId;
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
                            {msg.isVideoCall ? (
                              <div className="flex items-center space-x-2">
                                <Video className={`h-5 w-5 ${isCurrentUser ? 'text-white' : 'text-gray-700'}`} />
                                <span>Video Call</span>
                                <button
                                  onClick={() => handleJoinVideoCall(msg.videoLink || '')}
                                  className={`ml-2 px-2 py-1 rounded ${
                                    isCurrentUser ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                  } transition-colors text-sm flex items-center`}
                                >
                                  <span>Join</span>
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </button>
                              </div>
                            ) : (
                              <p className="break-words">{msg.message}</p>
                            )}
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
                        disabled={isProcessing}
                        className="p-2 bg-[#1e1b4b] text-white rounded-lg hover:bg-[#29256d] focus:outline-none transition-colors"
                      >
                        <Send className="h-5 w-5" />
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