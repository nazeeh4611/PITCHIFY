import { IInvestordata } from "../Database/Model/Investormodel";
import { investorModel } from "../Database/Model/Investormodel";
import { IInvestorRepository } from "../../Domain/Interface/InvestorInterface";
import { Investor } from "../../Domain/entities";

export class InvestorRepository implements IInvestorRepository {
    async findbyEmail(email: string): Promise<IInvestordata | null> {
        try {
            return (await investorModel.findOne({ email })) as IInvestordata;
        } catch (error) {
            throw new Error(`Error occurred while searching for investor with email: ${email}`);
        }
    }

    async getbyId(id: string): Promise<IInvestordata | null> {
        try {
            return await investorModel.findOne({ _id: id });
        } catch (error) {
            throw new Error(`Error occurred while retrieving investor by ID: ${id}`);
        }
    }

    async saveinvestor(user: Investor): Promise<IInvestordata> {
        try {
            const createInvestor = new investorModel(user);
            return (await createInvestor.save()) as IInvestordata;
        } catch (error) {
            throw new Error("Error occurred while saving investor");
        }
    }

    async update(user: Partial<Investor>): Promise<IInvestordata> {
        try {
            const updatedInvestor = await investorModel.findOneAndUpdate(
                { email: user.email },
                { firstname: user.firstname, lastname: user.lastname, phone: user.phone },
                { new: true }
            );

            if (!updatedInvestor) {
                throw new Error("Failed to update investor: User not found");
            }

            return updatedInvestor as IInvestordata;
        } catch (error) {
            throw new Error("Error occurred while updating investor details");
        }
    }

    async verifyinvestor(email: string, companydetails: Buffer): Promise<IInvestordata> {
        try {
            const verifiedinvestor = await investorModel.findOneAndUpdate(
                { email: email },
                { companydetails: companydetails },
                { new: true }
            );

            if (!verifiedinvestor) {
                throw new Error(`Failed to verify investor with email: ${email}`);
            }

            return verifiedinvestor as IInvestordata;
        } catch (error) {
            throw new Error(`Error occurred while verifying investor with email: ${email}`);
        }
    }
}