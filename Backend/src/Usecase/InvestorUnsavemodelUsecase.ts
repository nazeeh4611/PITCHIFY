import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"

export class UnsavemodelUsecase{
    constructor(
        private investorrepo:IInvestorRepository
    ){}

    async execute(email:string,modelId:string){
        try {
           const updatedInvestor = await this.investorrepo.unsavemodel(email,modelId)
           return updatedInvestor
        } catch (error) {
            
        }
    }
}