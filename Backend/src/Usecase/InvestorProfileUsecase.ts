import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"


export class InvestorProfileUsecas { 
    constructor(
        private Investorrepository : IInvestorRepository
    ){}
    

    async execute(email:string):Promise<any>{

        try {
            const Investor = await this.Investorrepository.findbyEmail(email)

            return {
                Investor
            }
        } catch (error) {
            console.error("error occured in find data ")
        }
    }
}