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


    async update(user: Partial<Investor>): Promise<IInvestordata> {
        try {
            // Update the entrepreneur by their unique email
            const updatedInvestor = await investorModel.findOneAndUpdate(
                { email: user.email },  // Using email to find the user
                { firstname: user.firstname,lastname:user.lastname, phone: user.phone },  // Only update the fields provided
                { new: true }  // To return the updated document
            );
    
            if (!updatedInvestor) {
                throw new Error("Failed to update investor: User not found");
            }
    
            return updatedInvestor as IInvestordata;
        } catch (error) {
            console.error("Error while updating investor:", error);
            throw new Error("Error occurred while updating investor");
        }
    }
    
}