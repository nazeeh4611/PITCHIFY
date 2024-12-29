import { Request, Response, NextFunction } from 'express';
import { InvestorSignupusecase,investorverifyOtpUsecase,InvestorLoginUsecase,InvestorProfileUsecas,InvestorProfileEditUsecase,Investorverifyusecase} from '../../Usecase'
import * as CryptoJS from 'crypto-js';
import { generateRefreshToken,generateToken } from '../Middleware/tokenauth';
import  jwt,{ JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import multer from "multer";
import fs from 'fs'; 


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
        private verifyusecase:Investorverifyusecase
        
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
            console.log(error)
            res.status(500).json({sucsess:false,message:"Internal server error"})
            next(error)
        }
    }


    async verifyOtp(req:Request,res:Response,next:NextFunction):Promise <void>{
        try {
            const {otp,emaildata} = req.body;

            const email = emaildata;

            console.log("hsdsdgashd",email)
            console.log("email is ",email,"otp is ",otp)
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
                console.log(response,"this be the respons")
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
            console.log(email,"is email")
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            
            const response = await this.profileusecase.execute(email);
    
            if (response) {
                console.log(response,"here the respons")
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
         console.log(response,"opoppppo")
           res.status(200).json({success:false,message:"data is updated"})
        } catch (error) {
            
        }
    }

    async verifyInvestor(req: Request, res: Response, next: NextFunction) {
        try {
        //   const { companyName, email } = req.body;
        //   const file = req.file;
        //   console.log("file",file)
      
        //   const companydetails = file ? fs.readFileSync(file.path) : null; 
          
        //   console.log("companydetails:",typeof companydetails); 

        //   if (!companyName || !email || !file) {
        //     return res.status(400).json({ message: "Company name, email, and file are required." });
        //   }
      
      
        //   if (!companydetails) {
        //     return res.status(400).json({ message: "File content not found." });
        //   }
      
        //   const response = await this.verifyusecase.execute(email, companydetails);
        //   if (response) {
        //     return res.status(200).json({ success: true, message: "Investor verified successfully" });
        //   }
      
        //   return res.status(500).json({ message: "Investor verification failed" });
      
        } catch (error) {
          next(error);
        }
      }
      
    
      

}
