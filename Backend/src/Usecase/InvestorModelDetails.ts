import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"


export class Investormodeldetails{
    constructor(
        private investorrepo:IInvestorRepository
    ){}


    async execute(id:string){
        try {
            const details = await this.investorrepo.modelDetails(id)
            return details
        } catch (error) {
            
        }
    }
}