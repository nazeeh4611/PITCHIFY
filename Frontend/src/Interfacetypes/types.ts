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


