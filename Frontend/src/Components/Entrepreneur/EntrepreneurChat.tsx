import React, { useState, useEffect } from 'react';
import { Send, Video, Search, ExternalLink, Menu, X } from 'lucide-react';
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
import { ChatMessage,Chat,Investor,MessageResponse } from '../../Interfacetypes/types';

interface ChatResponse {
  investor: Investor[];
  latestmessage?: { message: string; createdAt: string }[];
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

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
    
    handleSendVideoMessage(roomLink);
    
    navigate(loc);
  };

  const handleJoinVideoCall = (videoLink: string) => {
    if (!videoLink) return;
    
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
      if (window.innerWidth < 768) {
        setShowChatList(false);
      }
    }
  }, [activeChat]);

  useEffect(() => {
    const newSocket = io("http://localhost:3009");
    setSocket(newSocket);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowChatList(true);
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
        if (activeChat) {
          setShowChatList(false);
        } else {
          setShowChatList(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      newSocket.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data: any) => {
        if (data.sender !== currentUserId) {
          if (data.message && data.message.includes('video call')) {
            const linkMatch = data.message.match(/Join using this link: (.+)/);
            const videoLink = linkMatch ? linkMatch[1] : '';
            
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
            
            if (window.confirm('You received a video call invitation. Would you like to join?')) {
              handleJoinVideoCall(videoLink);
            }
          } else {
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

  const handleBackToChats = () => {
    setShowChatList(true);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    if (window.innerWidth < 768) {
      setShowChatList(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderLoadingState = () => (
    <div className="flex-1 flex justify-center items-center bg-gray-100 p-4">
        <div
          className="bg-white rounded-[2%] shadow-lg p-1 sm:p-2 md:p-4 flex flex-col md:flex-row w-full max-w-full sm:max-w-full md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            height: "80vh",
          }}
        >
        <div className="hidden md:block md:w-1/4 border-r border-gray-200">
          <Sidebar onSectionChange={(id) => console.log(id)} />
        </div>

        <div className="w-full md:w-3/4 flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="bg-[#1e1b4b] p-4">
              <h1 className="text-2xl font-bold mb-4 text-white">Chats</h1>
              <div className="relative">
                <div className="w-full p-2 pl-8 rounded-lg border border-gray-300 bg-gray-200 animate-pulse h-10"></div>
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center p-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-10"></div>
                    </div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:w-2/3 flex-col">
            <div className="bg-[#1e1b4b] p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-300 animate-pulse rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 animate-pulse rounded w-16"></div>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-300 animate-pulse rounded"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      i % 2 === 0
                        ? 'bg-gray-200 animate-pulse'
                        : 'bg-gray-300 animate-pulse'
                    }`}
                    style={{ height: '50px', width: `${Math.floor(Math.random() * 30) + 40}%` }}
                  ></div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => (
    <div className="flex-1 flex justify-center items-center bg-gray-100 p-2 sm:p-4">
      <div
        className="bg-white rounded-[2%] shadow-lg p-1 sm:p-2 md:p-4 flex flex-col md:flex-row w-full max-w-full sm:max-w-full md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
        style={{ height: "80vh" }}
      >
        <div className="md:hidden absolute top-2 left-2 z-20">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-[#1e1b4b] rounded-lg hover:bg-gray-100"
          >
            {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div 
          className={`${showSidebar ? 'block' : 'hidden'} md:block absolute md:relative z-10 bg-white w-3/4 md:w-1/4 h-full border-r border-gray-200`}
        > 
          <Sidebar onSectionChange={(id) => console.log(id)} />
        </div>
        <div className="w-full md:w-3/4 flex flex-col md:flex-row h-full">
          <div className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3 border-r border-gray-200 flex flex-col md:mt-0 mt-12 h-full`}>
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
                  onClick={() => handleChatSelect(chat.id)}
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

          <div className={`${!showChatList ? 'block' : 'hidden'} md:block w-full md:w-2/3 flex flex-col h-full`}>
            {activeChat ? (
              <>
                <div className="bg-[#1e1b4b] text-white p-4 flex items-center justify-between">
                  {!showChatList && (
                    <button 
                      onClick={handleBackToChats}
                      className="md:hidden mr-2 text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  )}
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

                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(100% - 140px)" }}>
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
                          className={`max-w-[70%] sm:max-w-[70%] md:max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-[#1e1b4b] text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          {msg.isVideoCall ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                              <div className="flex items-center">
                                <Video className={`h-5 w-5 ${isCurrentUser ? 'text-white' : 'text-gray-700'}`} />
                                <span className="ml-1">Video Call</span>
                              </div>
                              <button
                                onClick={() => handleJoinVideoCall(msg.videoLink || '')}
                                className={`px-2 py-1 rounded ${
                                  isCurrentUser ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                } transition-colors text-sm flex items-center`}
                              >
                                <span>Join</span>
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </button>
                            </div>
                          ) : (
                            <p className="break-words text-sm sm:text-base">{msg.message}</p>
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

                <div className="p-2 sm:p-4 border-t border-gray-200">
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
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
                <img 
                  src={shortlogo} 
                  alt="Logo" 
                  className="w-16 h-16 mb-4 opacity-50"
                />
                <p className="text-center">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
      {loading ? renderLoadingState() : renderMainContent()}
    </div>
  );
};

export default EntrepreneurChat;