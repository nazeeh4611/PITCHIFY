// export interface Investor {
//     _id:string,
//     firstname:string,
//     lastname:string,
//     phone:string,
//     email:string,
//     password:string,
//     confirmpassword:string,
//     avatar:string,
// }

import { Types } from "mongoose";

export interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }


  export interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    createdAt: string;
    avatar: string;
  }
  
  export interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    status: string;
    receiverId: string;
  }

  
  export interface Investor {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar:string;
    phone:string;
    companyname:string;
    premium:Premium
  }

  export interface Premium {
    plan:Types.ObjectId
    endDate:Date,
    startDate:Date
  }
  
  export interface ChatResponse {
    _id: string;
    chatname: string;
    entrepreneur: any[];
    investor: Investor[];
    latestmessage: any[];
    relatedModel: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MessageResponse {
    _id: string;
    sender: string;
    content: string;
    chat: string;
    createdAt: string;
    reciever?: string;
    isRead?: boolean;
  }



  export interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    createdAt: string;
    avatar: string;
    isVideoCall?: boolean;
    videoLink?: string;
  }
  
  export interface PremiumPlanState {
    planName: string;
    Duration: number; 
    planPrice: number;
    description: string; 
    features: string[];
    buttonText: string;
  }


  export interface FetchedPremiumPlan {
    _id: string;
    planName: string;
    Duration: number;
    planPrice: number;
    description: string; 
    is_Listed: boolean;
    features: string[]; 
    buttonText: string;  
  }


  export interface BusinessModel {
    _id: string;
    businessName: string;
    tagline: string;
    fundinggoal: string;
    targetAudience: string;
    solution: string;
    problemStatement: string;
    useOfFunds: string;
    marketOpportunities: string;
    teamexpertise: string;
    pitchvideo: string;
    industryFocus: {
      categoryname: string;
      image: string;
      is_Listed: boolean;
    };
    createdAt: string;
    uploadedentrepreneur: {
      profile: string;
      firstname: string;
      _id: string;
    };
  }
