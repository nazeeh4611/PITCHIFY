import { Investor } from "../entities";
import {IInvestordata} from "../../Infrastructure/Database/Model/Investormodel"

export interface IInvestorRepository {
    getbyId(id: string): Promise<IInvestordata | null>;
    saveinvestor(user: Investor): Promise<IInvestordata>;
        findbyEmail(email: string): Promise<IInvestordata | null>;
}