import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import { AdminLoginUsecase,GetEntrpreneurUsecase,GetInvestorUsecase } from "../../Usecase";

export class AdminController {
    constructor(
        private loginusecase:AdminLoginUsecase,
        private getInvestorusecase:GetInvestorUsecase,
        private getEntrepreneurusecase:GetEntrpreneurUsecase
    ){}


    async adminLogin(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {email,password} = req.body
            if(!email || password ){
                res.status(400).json({success:false,message:"email and password required"})
                return
            }
            const response = await this.loginusecase.execute(email,password)

            if(response){
                console.log(response)
            }
            const token = response.token
            res.status(200).json({success:true,token})
        } catch (error) {
            console.error(error)
            res.status(500).json({success:false,message:"internal server error"})
        }
    }


    async getInvestor(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
           const InvestorData = await this.getInvestorusecase.execute();
           if(InvestorData){
            console.log(InvestorData,"the lkist")
            res.status(200).json(InvestorData)
           }else{
            res.status(404).json({suceess:false,message:"investor data not found"})
           }
        } catch (error) {
            console.error(error)
            res.status(500).json({success:false,message:"internal server error"})
        }
    }

    async getEntrepreneur(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const EntrepreneurData = await this.getEntrepreneurusecase.execute();
           
            if(EntrepreneurData){
                res.status(200).json(EntrepreneurData)
            }else{
                res.status(404).json({success:false,message:"Entrepreneur data not found"})
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({success:false,message:"Internal server error"})
        }
}

}