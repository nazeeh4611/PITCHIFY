import { IInvestordata } from "../Database/Model/Investormodel";
import {investorModel} from "../Database/Model/Investormodel"
import Entrepreneurmodel from "../Database/Model/Entrepreneurmodel";
import { IEntrepreneurdata } from "../Database/Model/Entrepreneurmodel";
import { Iadminrepository } from "../../Domain/Interface/AdminInterface";

export class AdminRepository implements Iadminrepository {
    constructor() {}

    async findEmail(email: string): Promise<IEntrepreneurdata | null> {
        return await Entrepreneurmodel.findOne({ email }).lean<IEntrepreneurdata>() || null;
    }

    async getAllEntrepreneur(): Promise<IEntrepreneurdata[] | null> {
        try {
            const entrepreneurs = await Entrepreneurmodel.find().lean<IEntrepreneurdata[]>();
            return entrepreneurs.length > 0 ? entrepreneurs : null;
        } catch (error) {
            throw new Error("Error occurred in getAllEntrepreneur: ");
        }
    }
    
    async getAllInvestor(): Promise<IInvestordata[] | null> {
        try {
            const investors = await investorModel.find().lean<IInvestordata[]>();
            return investors.length > 0 ? investors : null;
        } catch (error) {
            throw new Error("Error occurred in getAllInvestor: ");
        }
    }
}
