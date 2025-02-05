import { Types } from "mongoose";
import { Response } from "express";
import { Entrepreneur } from "../Domain/entities/entrepreneurentities";
import { entrepreneurRepository } from "../Infrastructure/Repository";
import { OtpService } from "../Infrastructure/service/Otpservice";
import {hashpass} from "../Infrastructure/Utils/hashpass"

type SignupResponse = Entrepreneur | {message:string};

export class signupUsecase{

    constructor(
       private entrepreneurRepo:entrepreneurRepository,
       private otpservice:OtpService 

    ){}

    async execute(firstname:string,lastname:string,email:string,phone:number,password:string,confirmpassword:string,res:Response){


        if(!firstname || !lastname || !email || !phone || !password || !confirmpassword){
            return {message:"invalid inputs"}
        }

        
        if(password !== confirmpassword){
            return {message:"Password not match"}
        }


        const existEmail = await this.entrepreneurRepo.findbyEmail(email);

        if(existEmail){
            return {message:"this email already exist"}
        }

        const hashedpass = await hashpass(password)


        const otp = this.otpservice.generateOtp();

        const entrepreneur = new Entrepreneur({
            _id:new Types.ObjectId(),
            firstname,
            lastname,
            email,
            phone,
            password:hashedpass,
            confirmpassword:hashedpass,
            otp
        })



       
            

      

        const message = `YOUR OTP CODE IS  ${otp}`;
        const subject = `Enter Otp for Your Registration`;

        await this.otpservice.sendMail(email,subject,message);

        const entrepreneurData = entrepreneur.toIEntrepreneurData()
        const savedentrepreneurData = await this.entrepreneurRepo.saveentrepreneur(entrepreneurData as any)

        const savedentrepreneur = new Entrepreneur(savedentrepreneurData)
        
        return savedentrepreneur



    }
}