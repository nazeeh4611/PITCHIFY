import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"

export class Reviewusecase{
    constructor(
        private investorrepo:IInvestorRepository
    ){}

 async execute(modelId:string,rating:number,review:string,email:string){
    try {
        const data = await this.investorrepo.addreview(modelId,rating,review,email)
    } catch (error) {
        
    }
 }
    
}