import { Types } from "mongoose";
import { Response } from "express";
import { Investor } from "../Domain/entities/Investorentity";
import { InvestorRepository } from "../Infrastructure/Repository/InvestorRepository";
import {OtpService} from "../Infrastructure/service/Otpservice";
import {hashpass} from "../Infrastructure/Utils/hashpass"


export class InvestorSignupusecase { 

    constructor(
        private investorRepo:InvestorRepository,
        private otpService:OtpService
    ){}

    async execute(firstname:string,lastname:string,email:string,phone:number,password:string,confirmpassword:string,res:Response){




        if(!firstname || !lastname || !email || !phone || !password || !confirmpassword){
            return {message:"invalid inputs"}
        }

        
        if(password !== confirmpassword){
            return {message:"Password not match"}
        }

        const existEmail = await this.investorRepo.findbyEmail(email);
 


        if(existEmail){
            return {message:"this email already exist"}
        }

        const hashedpass = await hashpass(password)


        const otp = this.otpService.generateOtp();

        const investor = new Investor({
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

        await this.otpService.sendMail(email,subject,message);

        const entrepreneurData = investor.toInvestorData()
        const savedentrepreneurData = await this.investorRepo.saveinvestor(entrepreneurData as any)

        const savedentrepreneur = new Investor(savedentrepreneurData)
        
        return savedentrepreneur



    }
}