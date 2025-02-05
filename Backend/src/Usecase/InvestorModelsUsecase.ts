import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"

export class investorModelsUsecase{
    constructor(
   private investorrepo:IInvestorRepository
    ){}

    async execute(category:string){
        try {
            const models = await this.investorrepo.modelsbycategory(category)
            return models
        } catch (error) {
            
        }
    }
}