import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"

export class exclusivemodelUsecase{
    constructor(
       private investorrepo:IInvestorRepository
    ){}


    async execute(){
        const data  = await this.investorrepo.exclusiveModel()

        console.log(data)
        return data
    }
}