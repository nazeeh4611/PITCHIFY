// JoinMeeting.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useGetToken } from '../../token/Gettoken';

const JoinMeeting = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const token = useGetToken("entrepreneur");
  const email = token?.email;

  useEffect(() => {
    const initMeeting = async () => {
      const appID = 841096558;
      const serverSecret = "7b681ef204754d8c4a37b070933a4ce9";
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId || '',
        Date.now().toString(),
        email || 'Guest'
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      
      zc.joinRoom({
        container: document.querySelector<HTMLDivElement>("#meeting-container"),
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true
      });
    };

    if (roomId) {
      initMeeting();
    }
  }, [roomId, email]);

  return (
    <div className="h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h1 className="text-2xl font-bold mb-4">Join Meeting</h1>
          <div id="meeting-container" className="w-full h-[600px]" />
        </div>
      </div>
    </div>
  );
};

export default JoinMeeting;