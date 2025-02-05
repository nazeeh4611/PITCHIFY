
import { Types } from "mongoose";
import {IInvestorRepository} from "../Domain/Interface/InvestorInterface" 


export class getReciever{
    constructor(
private investorepo:IInvestorRepository
    ){}


    async execute(id:string){

        const result = await this.investorepo.getReciever(id)
        return result
    }
}