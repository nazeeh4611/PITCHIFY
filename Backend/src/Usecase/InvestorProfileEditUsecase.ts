import {IInvestordata} from "../Domain/entities/Investorentity"
import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"

export class InvestorProfileEditUsecase{
     constructor(
        private InvestorRepository:IInvestorRepository
    ){}

    async execute(email:string,firstname:string,lastname:string,phone:number):Promise<IInvestordata | null>{
        try {
            const updatedInvestor = await this.InvestorRepository.update({email,firstname,lastname,phone})
            if(!updatedInvestor){
                throw new Error("failed to find investor")
            }
            return updatedInvestor

        } catch (error) {
            console.error(error)
            throw error
        }
    }
}



