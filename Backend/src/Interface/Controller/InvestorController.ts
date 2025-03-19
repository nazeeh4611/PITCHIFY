import { Request, Response, NextFunction } from 'express';
import {stripe} from "../../Infrastructure/Utils/Stripe"
import { InvestorSignupusecase,
    investorverifyOtpUsecase,
    InvestorLoginUsecase,
    InvestorProfileUsecas
    ,InvestorProfileEditUsecase,
    Investorverifyusecase,
    investordetailsusecase,
    investorModelsUsecase,
    Investormodeldetails,
    Getplanusecase,
    Investorsubscritptionusecase,
    Reviewusecase,
    CreateChatUseCase,
    MessageUseCase,
    getReciever,
    getAllchatusecase,
    GoogleAuthUsecase,
    savemodelUsecase,
    UnsavemodelUsecase,
    exclusivemodelUsecase,
} from '../../Usecase'
import * as CryptoJS from 'crypto-js';
import { generateRefreshToken,generateToken } from '../Middleware/tokenauth';
import  jwt,{ JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import multer from "multer";
import fs from 'fs'; 
import { Types } from 'mongoose';


const upload = multer({ dest: 'uploads/' });


export class InvestorController{
    private readonly jwtsecret: string
    private readonly jwtrefreshsecret:string
    constructor(
        private signupusecase:InvestorSignupusecase,
        private verifyotpusecase:investorverifyOtpUsecase,
        private loginusecase:InvestorLoginUsecase,
        private profileusecase:InvestorProfileUsecas,
        private editprofileusecase:InvestorProfileEditUsecase,
        private verifyusecase:Investorverifyusecase,
        private detailsusecase:investordetailsusecase,
        private modelsusecase:investorModelsUsecase,
        private modeldetails:Investormodeldetails,
        private getplanusecase:Getplanusecase,
        private premiumusecase:Investorsubscritptionusecase,
        private reviewusecase:Reviewusecase,
        private createChatUseCase:CreateChatUseCase,
        private MessageUseCase:MessageUseCase,
        private getReciever:getReciever,
        private getchatsusecase:getAllchatusecase,
        private googleauthusecase:GoogleAuthUsecase,
        private savemodelusecase:savemodelUsecase,
        private unsavemodelusecase:UnsavemodelUsecase,
        private exclusivemodelusecase:exclusivemodelUsecase
        ){
            const secret = process.env.JWT_SECRET
            const refreshSecret = process.env.JWT_REFRESHSECRET
            
            if(!secret || !refreshSecret){
                throw new Error("the secret is missing in env")
            }

            this.jwtsecret = secret;
            this.jwtrefreshsecret = refreshSecret;
        }
        

    // private verifyToken(token:string):{
    //   id:string,
    //   email:string,
    //   iat:number;
    //   exp:number
    // }{
    //     try {
    //         return jwt.verify(token,this.jwtsecret) as {
    //             id:string;
    //             email:string;
    //             iat:number;
    //             exp:number;
    //         };
    //     } catch (error) {
    //         if(error instanceof jwt.TokenExpiredError){
    //             throw new Error("token expired")
    //         }else if( error instanceof jwt.JsonWebTokenError){
    //             throw new Error("invalid token")
    //         }
    //         throw error;
    //     }
    // }


    async signup(req:Request,res:Response,next:NextFunction):Promise<void>{
        const { firstname, lastname, phone, email, password, confirmpassword } = req.body;

        if( !firstname|| !lastname|| !phone|| !email|| !password|| !confirmpassword ){
            res.status(404).json({success:false,message:"firstname, lastname, phone, email, password, confirmpassword are required"})
        }
        try {
            const investor = await this.signupusecase.execute(
                firstname,
                lastname,
                email,
                phone,
                password,
                confirmpassword,
                res
            )
            res.status(200).json({success:true,investor})
        } catch (error) {
            res.status(500).json({sucsess:false,message:"Internal server error"})
            next(error)
        }
    }


    async googleLogin(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {token,user} = req.body
  
             const response = await this.googleauthusecase.execute(token,user)
             if(response){
      
              const token = response.token
              const refreshToken = response.refreshToken
      
              res.cookie('refreshToken', refreshToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production', 
                  maxAge: 7 * 24 * 60 * 60 * 1000 
              });
      
              res.status(200).json({sucess:true,token})
             }
        
             
        } catch (error) {
            console.error(error)
            res.status(500).json({message:"Internal server error"})
        }
    }

    async verifyOtp(req:Request,res:Response,next:NextFunction):Promise <void>{
        try {
            const {otp,emaildata} = req.body;

            const email = emaildata;


            if(!email){
                throw new Error("the email is not getting")
            }
            const response = await this.verifyotpusecase.execute(Number(otp),email)
               const token = response.token
                if(response.success){
            res.status(200).json({success:true,message:"otp verified",token})
                }else{
                    res.status(401).json({success:false,message:"Invalid Otp"})
                }
        } catch (error) {
            console.error(error,"Error occured in veryfying otp")
            res.status(500).json({sucsess:false,message:"Internal server error"})
            throw new Error("Error occured in verifying otp")
        }
    }


    async login(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try {
            const {email,password} = req.body
            if(!email || !password){
                res.status(400).json({success:false,message:"email and password required"})
            }
            const response = await this.loginusecase.execute(email,password)

            if(response){
                const token = response.token
                res.status(200).json({success:true,message:"login verified",token})
            }
            
        } catch (error) {
            console.error(error,"Error occured in login")
            res.status(500).json({sucsess:false,message:"Internal server error"})
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            
            const response = await this.profileusecase.execute(email);
    
            if (response) {
                res.status(200).json({
                    message: "Profile fetched successfully",
                    investor: response,
                });
            } else {
                res.status(404).json({ message: "Profile not found" });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ message: "Internal server error" });
            next(error);
        }
    }



    async editProfile(req:Request,res:Response,next:NextFunction){
        try {
            const updatedProfile = req.body

            const email = updatedProfile.email
            const phone = updatedProfile.phone
            const fname = updatedProfile.firstname
            const lname = updatedProfile.lastname
         const response = await this.editprofileusecase.execute(email,fname,lname,phone)
           res.status(200).json({success:false,message:"data is updated"})
        } catch (error) {
            
        }
    }

 

    
    async verifyInvestor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { companyName, email,status } = req.body;
            const file = (req.file as Express.MulterS3.File).location;
    
            if (!companyName || !email || !file) {
                res.status(400).json({ message: "Company name, email, and file are required." });
                return; 
            }

            const companyDetails = file
    
            const response = await this.verifyusecase.execute(email, companyDetails,status,companyName);
            if (response) {
                res.status(200).json({ success: true, message: "Investor verified successfully" });
            } else {
                res.status(500).json({ message: "Investor verification failed" });
            }
        } catch (error) {
            next(error);
        }
    }

    async InvestorDetails(req:Request,res:Response,next:NextFunction):Promise<void>{
          try {
            const email = req.query.email
            if(typeof email == "string"){
                const response = await this.detailsusecase.execute(email)
                res.status(200).json(response)
            }
          } catch (error) {
            
          }
    }
    

   async GetModels(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const id = req.body.category
        const response = await this.modelsusecase.execute(id)
        res.status(200).json(response)
    } catch (error) {
        
    }
   }

   async modelDetails(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const id = req.params.id

       const response = await this.modeldetails.execute(id)
       res.status(200).json(response)
    } catch (error) {
        
    } 
   }
      
   async subscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount, currency,id,duration,email } = req.body;
  
      const startdate = new Date();
        
      const enddate = new Date(startdate);
      enddate.setMonth(startdate.getMonth() + duration); 


      const paymentIntent = await stripe.paymentIntents.create({
        amount, 
        currency,
      });
      const response = await this.premiumusecase.execute(id,startdate,enddate,email)
     if(response){
         res.status(200).json({ clientSecret: paymentIntent.client_secret });
     }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async getPlans(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const response  = await this.getplanusecase.execute()
        res.status(200).json(response)
    } catch (error) {
        
    }
  }


  async rating(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const {modelId,rating,review,email} = req.body
        const response = await this.reviewusecase.execute(modelId,rating,review,email)
        res.status(200).json({success:true,message:"review added"})

    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
  }



  async createChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { entrepreneurId, investorEmail, modelId } = req.body;


        const { chatId } = await this.createChatUseCase.execute({
            entrepreneurId,
            investorEmail,
            modelId
        });

        // Ensure chatId is not undefined
        if (!chatId) {
            res.status(500).json({ 
                message: "Failed to create or find chat" 
            });
            return;
        }

        res.status(201).json({ chatId });
    } catch (error) {
        console.error("Chat Creation Controller Error:", error);
        res.status(500).json({ 
            message: "Error creating chat", 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}


async addMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { sender, chatId, message, receiverId, timestamp } = req.body;
        
        const data = {
            chatId,
            senderId: sender,  
            receiverId,
            content: message,  
            createdAt: timestamp 
        };

        const response = await this.MessageUseCase.sendMessage(data);
        res.status(200).json(response)
    } catch (error) {
        console.error("Error in addMessage:", error);
        next(error);
    }
}

async message(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { chatId } = req.params;


        if (!chatId) {
            res.status(400).json({ success: false, message: "Chat ID is required" });
            return;
        }

        const messages = await this.MessageUseCase.getChatMessages(chatId);

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        
        res.status(500).json({ success: false, message: "Internal server error" });
        next(error);
    }
}


async getMessageReciever(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const {id} = req.params

        const response = await this.getReciever.execute(id)
        res.status(200).json(response)
    } catch (error) {
        
    }
}


async getChat(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const id = req.params.id
         const response = await this.getchatsusecase.execute(id)

         res.status(200).json({success:true,response})
    } catch (error) {
        
    }
}

async savemodel(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const {email,model} = req.body
        
        const response = await this.savemodelusecase.execute(email,model)
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({messaage:"Internal server error"})
    }
}

async unsavemodel(req:Request,res:Response,next:NextFunction):Promise<void>{
   try {
    const {email,model} = req.body

    const response = await this.unsavemodelusecase.execute(email,model)

    res.status(200).json(response)
   } catch (error) {
    console.error(error)
     res.status(500).json({messaage:"Internal server error"})
   }
}

async exclusivemodel(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const response = await this.exclusivemodelusecase.execute()

        res.status(200).json(response)
    } catch (error) {
        
    }
}


}



