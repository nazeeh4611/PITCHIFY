
import { Types } from "mongoose";
import {Iadminrepository} from "../Domain/Interface/AdminInterface"

export class AdminInvestorDetailsusecase{
   constructor(
    private  adminrepo:Iadminrepository
   ){}

   async execute(id:string){
    try {
        const investordetails = await this.adminrepo.investorDetails(id)
        return investordetails
    } catch (error) {
        
    }
   }
}