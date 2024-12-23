import { IInvestordata } from "../Database/Model/Investormodel";
import {investorModel} from "../Database/Model/Investormodel";
import { IInvestorRepository } from "../../Domain/Interface/InvestorInterface";
import { Investor } from "../../Domain/entities";

export class InvestorRepository implements IInvestorRepository{
    async findbyEmail(email: string): Promise<IInvestordata | null> {
          return (await investorModel.findOne({email})) as IInvestordata   
    }
    async getbyId(id: string): Promise<IInvestordata | null> {
        try {
            return await investorModel.findOne({_id:id})
        } catch (error) {
            throw new Error("error occured in db")
        }
    }
    async saveinvestor(user: Investor): Promise<IInvestordata> {
        try {
            const createInvestor = new investorModel(user)
            return (await createInvestor.save()) as IInvestordata;
        } catch (error) {
            throw new Error("erro ocuured while save investor")
        }
    }
}