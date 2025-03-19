import React, { useState, useEffect, useRef } from 'react';
import { Send, Video, Search, ExternalLink, Menu, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import logo from "../Layout/Image/logo.jpeg";
import Sidebar from './InvestorSidebar';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
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
  isVideoCall?: boolean;
  videoLink?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  status: 'online' | 'offline';
  userId: string;
}

interface Entrepreneur {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  premium: any;
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
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [receiver, setReceiver] = useState<Entrepreneur | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const api = axios.create({
    baseURL: baseurl,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const token = useGetToken("investor");
  const email = token?.email;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVideoCall = () => {
    if (!activeChat) return;
    const videoCallLink = `${window.location.origin}/entrepreneur/video-call/${activeChat}`;
    const videoMessage = `I've started a video call.`;
    
    handleSendVideoMessage(videoMessage, videoCallLink);
    
    navigate(`/investor/video-call/${activeChat}`, {
      state: {
        currentUserId: currentUserId,
        userName: userName || email
      }
    });
  };

  const handleJoinVideoCall = (videoLink: string) => {
    const linkMatch = videoLink.match(/\/video-call\/([^"'\s]+)/);
    if (linkMatch && linkMatch[1]) {
      const extractedChatId = linkMatch[1];
      navigate(`/investor/video-call/${extractedChatId}`, {
        state: {
          currentUserId: currentUserId,
          userName: userName || email
        }
      });
    }
  };

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
      const response = await api.post("/investor/profile", { email });
      const investor = response.data.investor.Investor;
      setCurrentUserId(investor._id);
      setUserName(`${investor.firstname} ${investor.lastname}`);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const getChat = async () => {
    try {
      const response = await api.get(`/investor/get-chat/${currentUserId}`);
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
          avatar: chat.entrepreneur.profile || "/api/placeholder/40/40",
          status: onlineUsers[chat.entrepreneur._id] ? 'online' : 'offline',
          userId: chat.entrepreneur._id
        }));
        setChats(formattedChats);
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
    if (currentUserId) {
      getChat();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
      const chat = chats.find(c => c.id === activeChat);
      if (chat) {
        const chatReceiver: Entrepreneur = {
          _id: chat.userId,
          firstname: chat.name.split(' ')[0],
          lastname: chat.name.split(' ')[1] || '',
          email: '',
          premium: null
        };
        setReceiver(chatReceiver);
      }
      
      if (window.innerWidth < 768) {
        setShowChatList(false);
      }
    }
  }, [activeChat, chats]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
        setShowChatList(true);
      } else if (window.innerWidth >= 768) {
        setShowSidebar(false);
        setShowChatList(true);
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
      window.removeEventListener('resize', handleResize);
    };
  }, [activeChat]);

  useEffect(() => {
    const newSocket = io("http://localhost:3009");
    setSocket(newSocket);
  
    if (currentUserId) {
      newSocket.emit('setup', currentUserId);
    }
  
    newSocket.on('connected', () => {
      console.log('Socket connected');
      if (currentUserId) {
        newSocket.emit('join', { userId: currentUserId });
      }
    });
  
    newSocket.on('user_online', (userId: string) => {
      setOnlineUsers(prev => ({
        ...prev,
        [userId]: true
      }));
      
      setChats(prevChats =>
        prevChats.map(chat => ({
          ...chat,
          status: chat.userId === userId ? 'online' : chat.status
        }))
      );
    });
  
    newSocket.on('user_offline', (userId: string) => {
      setOnlineUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      
      setChats(prevChats =>
        prevChats.map(chat => ({
          ...chat,
          status: chat.userId === userId ? 'offline' : chat.status
        }))
      );
    });
  
    newSocket.on('get_online_users', (users: string[]) => {
      const onlineStatus: OnlineUsers = {};
      users.forEach(userId => {
        onlineStatus[userId] = true;
      });
      setOnlineUsers(onlineStatus);
      
      setChats(prevChats =>
        prevChats.map(chat => ({
          ...chat,
          status: onlineStatus[chat.userId] ? 'online' : 'offline'
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

  useEffect(() => {
    if (socket) {
      socket.removeAllListeners("receive_message");
      socket.on("receive_message", (data: any) => {
        if (data.sender !== email) {
          if (data.message && data.message.includes('video call')) {
            const linkMatch = data.message.match(/Join using this link: (.+)/);
            const videoLink = linkMatch ? linkMatch[1] : '';
            
            const formattedMessage: ChatMessage = {
              id: data.id,
              sender: data.sender,
              message: "Video Call",
              timestamp: data.timestamp,
              createdAt: data.createdAt,
              avatar: "/api/placeholder/40/40",
              isVideoCall: true,
              videoLink: videoLink
            };
            
            setMessages(prevMessages => {
              const messageExists = prevMessages.some(msg => msg.id === data.id);
              if (messageExists) return prevMessages;
              return [...prevMessages, formattedMessage];
            });
            
            if (window.confirm('You received a video call invitation. Would you like to join?')) {
              handleJoinVideoCall(videoLink);
            }
          } else {
            setMessages(prevMessages => {
              const messageExists = prevMessages.some(msg => msg.id === data.id);
              if (messageExists) return prevMessages;
              return [...prevMessages, data];
            });
          }
          
          setChats(prevChats => 
            prevChats.map(chat => 
              chat.id === activeChat 
                ? { ...chat, lastMessage: data.isVideoCall ? "Video Call" : data.message, timestamp: data.timestamp }
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

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message;
    if (messageToSend.trim() && socket && activeChat && email && !isProcessing) {
      try {
        setIsProcessing(true);
        const { time, fullDateTime } = formatDateTime();
        const messageData = {
          sender: currentUserId,
          email: email,
          chatId: activeChat,
          message: messageToSend.trim(),
          receiverId: receiver?._id,
          timestamp: time,
          createdAt: fullDateTime
        };

        const response = await api.post('/investor/send-message', messageData);
        if (response?.data) {
          const newMessage: ChatMessage = {
            id: response.data._id || Date.now().toString(),
            sender: currentUserId,
            message: messageToSend.trim(),
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
                ? { ...chat, lastMessage: messageToSend.trim(), timestamp: time }
                : chat
            )
          );

          socket.emit("send_message", {
            ...newMessage,
            chatId: activeChat,
            receiverId: receiver?._id
          });

          if (!customMessage) {
            setMessage("");
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSendVideoMessage = async (customMessage: string, videoLink: string) => {
    if (socket && activeChat && email && !isProcessing) {
      try {
        setIsProcessing(true);
        const { time, fullDateTime } = formatDateTime();
        const actualMessage = `${customMessage} Join using this link: ${videoLink}`;
        const messageData = {
          sender: currentUserId,
          email: email,
          chatId: activeChat,
          message: actualMessage,
          receiverId: receiver?._id,
          timestamp: time,
          createdAt: fullDateTime
        };

        const response = await api.post('/investor/send-message', messageData);
        if (response?.data) {
          const newMessage: ChatMessage = {
            id: response.data._id || Date.now().toString(),
            sender: currentUserId,
            message: "Video Call",
            timestamp: time,
            createdAt: fullDateTime,
            avatar: "/api/placeholder/40/40",
            isVideoCall: true,
            videoLink: videoLink
          };

          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
            if (messageExists) return prevMessages;
            return [...prevMessages, newMessage];
          });

          setChats(prevChats =>
            prevChats.map(chat =>
              chat.id === activeChat
                ? { ...chat, lastMessage: "Video Call", timestamp: time }
                : chat
            )
          );

          socket.emit("send_message", {
            ...messageData,
            id: response.data._id || Date.now().toString(),
            chatId: activeChat,
            receiverId: receiver?._id
          });
        }
      } catch (error) {
        console.error("Error sending video message:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/investor" },
          { label: "About Us", href: "/about-us" },
        ]}
      />

      <div className="flex-1 flex justify-center items-center bg-gray-100 p-2 sm:p-4 overflow-hidden">
        <div
          className="bg-white rounded-[2%] shadow-lg p-1 sm:p-2 md:p-4 flex flex-col md:flex-row w-full max-w-full sm:max-w-full md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] h-[80vh] overflow-hidden"
          style={{ maxHeight: "80vh" }}
        >
          {showSidebar && (
            <div className="lg:w-1/4 border-r border-gray-200 h-full overflow-y-auto">
              <Sidebar onSectionChange={(id) => console.log(id)} />
            </div>
          )}

          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            <div className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-[#1e1b4b] text-white">
              <button onClick={toggleSidebar} className="p-1">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold">Investor Chat</h1>
              <button onClick={toggleChatList} className="p-1">
                {showChatList ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
              </button>
            </div>

            {showChatList && (
              <div className="w-full md:w-1/3 lg:w-1/3 border-r border-gray-200 flex flex-col md:h-full fixed md:relative top-12 md:top-0 bottom-0 left-0 right-0 md:right-auto bg-white z-10 overflow-hidden">
                <div className="bg-[#1e1b4b] text-white p-4">
                  <h1 className="text-2xl font-bold mb-4 hidden md:block">Chats</h1>
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
                      onClick={() => {
                        setActiveChat(chat.id);
                        if (window.innerWidth < 768) {
                          setShowChatList(false);
                        }
                      }}
                    >
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          chat.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold truncate max-w-[120px] sm:max-w-[180px] md:max-w-[80px] lg:max-w-[120px]">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-[180px] sm:max-w-[240px] md:max-w-[140px] lg:max-w-[180px]">
                          {chat.lastMessage === "Video Call" ? (
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
            )}

            <div className={`flex-1 flex flex-col ${!showChatList ? 'w-full' : 'hidden md:flex'} md:relative md:h-full overflow-hidden`}>
              {activeChat ? (
                <>
                  <div className="bg-[#1e1b4b] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {window.innerWidth < 768 && (
                        <button 
                          onClick={toggleChatList} 
                          className="mr-2 p-1 rounded-full hover:bg-indigo-700"
                        >
                          <Search className="h-5 w-5" />
                        </button>
                      )}
                      <div className="relative">
                        <img
                          src={chats.find(c => c.id === activeChat)?.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          chats.find(c => c.id === activeChat)?.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold truncate max-w-[150px] sm:max-w-[200px]">
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
                    <Video 
                      className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition-colors" 
                      onClick={handleVideoCall}
                    />
                  </div>
  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(100% - 130px)" }}>
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
                            className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-[#1e1b4b] text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            {msg.isVideoCall ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <Video className={`h-5 w-5 ${isCurrentUser ? 'text-white' : 'text-gray-700'}`} />
                                <span>Video Call</span>
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
                    <div ref={messagesEndRef} />
                  </div>
  
                  <div className="p-2 sm:p-4 border-t border-gray-200 bg-white">
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
                        onClick={() => handleSendMessage()}
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
                  {window.innerWidth < 768 && !showChatList && (
                    <button
                      onClick={toggleChatList}
                      className="mt-4 p-2 bg-[#1e1b4b] text-white rounded-lg hover:bg-[#29256d] focus:outline-none transition-colors flex items-center"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      View Chats
                    </button>
                  )}
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