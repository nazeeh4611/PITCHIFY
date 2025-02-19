import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useGetToken } from '../../token/Gettoken';
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import logo from "../Layout/Image/logo.jpeg";
import axios from 'axios';
import { baseurl } from '../../Constent/regex';

const InvestorVideoCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const token = useGetToken("investor");
  const email = token?.email;
  const [userName, setUserName] = useState(email || '');
  const [userId, setUserId] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const api = axios.create({
    baseURL: baseurl,
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) return;

      try {
        const response = await api.post("/investor/profile", { email });
        setUserId(response.data.investor.Investor._id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData();
  }, [email]);

  useEffect(() => {
    if (!roomId || !userId || !userName || !containerRef.current) return;

    const initCall = async () => {
      const appID = 1010959051;
      const serverSecret = "1658a48bd7bade3734a6d85384d41f8f";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userId || email || 'user',
        userName
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      
      zc.joinRoom({
        container: containerRef.current,
        sharedLinks: [{
          name: 'Copy meeting link',
          url: window.location.href
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => navigate('/investor/chat')
      });
    };

    initCall();
  }, [roomId, userId, userName, email, navigate]);

  const handleBack = () => {
    navigate('/investor/chat');
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/investor" },
          { label: "About Us", href: "/about-us" },
        ]}
      />

      <div className="flex-1 flex flex-col bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 transition-colors"
          >
            <X className="h-5 w-5" />
            <span>End Call</span>
          </button>
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default InvestorVideoCallPage;