import { Request, Response, NextFunction } from 'express';
import { InvestorSignupusecase } from '../../Usecase/InvestorsignupUsecase';
import { investorverifyOtpUsecase } from '../../Usecase/InvestorVerifyotp';
import * as CryptoJS from 'crypto-js';
import { generateRefreshToken,generateToken } from '../Middleware/tokenauth';
import  jwt,{ JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export class InvestorController{
    private readonly jwtsecret: string
    private readonly jwtrefreshsecret:string
    constructor(
        private signupusecase:InvestorSignupusecase,
        private verifyotpusecase:investorverifyOtpUsecase,
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
        console.log("data is getting in controller",req.body)

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
            next(error)
        }
    }


    async verifyOtp(req:Request,res:Response,next:NextFunction):Promise <void>{
        try {
            const {otp,emaildata} = req.body;
            // console.log("Encoded emaildata received:", emaildata);
            // console.log("Decoded emaildata (before decryption):", decodeURIComponent(emaildata));
            
            // const decodedEmail = decodeURIComponent(emaildata); 
            // const bytes = CryptoJS.AES.decrypt(decodedEmail, "emailsecret");
            // const email = bytes.toString(CryptoJS.enc.Utf8);
            const email = emaildata;

            console.log("hsdsdgashd",email)
            console.log("email is ",email,"otp is ",otp)
            if(!email){
                throw new Error("the email is not getting")
            }



            const response = await this.verifyotpusecase.execute(Number(otp),email)
               const token = response.token
                if(response.success){
                // res.cookie("InvestorToken",token, {
                //     maxAge: 3600000,
                //     httpOnly: true,
                //     secure:true,
                //     sameSite: "none"
                //   });

            res.status(200).json({success:true,message:"otp verified",token})
                }
        } catch (error) {
            throw new Error("Error occured in verifying otp")
        }
    }

    
}