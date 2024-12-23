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
            const response = await this.loginusecase.execute(email,password)

            if(response){
                console.log(response)
            }
            const token = response.token
            res.status(200).json({success:false,token})
        } catch (error) {
            
        }
    }


    async getInvestor(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
           const InvestorData = await this.getInvestorusecase.execute();
           if(InvestorData){
            console.log(InvestorData,"the lkist")
            res.json(InvestorData)
           }
        } catch (error) {
            console.error(error)
        }
    }

    async getEntrepreneur(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const EntrepreneurData = await this.getEntrepreneurusecase.execute();
           
            if(EntrepreneurData){
                res.json(EntrepreneurData)
            }
        } catch (error) {
            console.error(error)
        }
}

}