import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"


export class savemodelUsecase{
    constructor(
        private investorrepo : IInvestorRepository
    ){}


    async execute(email:string,modelId:string){
     
        const updatedInvestor = await this.investorrepo.savemodel(email,modelId)
        console.log(updatedInvestor,"may in usecase ")
        return updatedInvestor
    }
}