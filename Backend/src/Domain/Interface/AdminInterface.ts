import { IInvestordata } from "../../Infrastructure/Database/Model/Investormodel";
import { IEntrepreneurdata } from "../../Infrastructure/Database/Model/Entrepreneurmodel";

export interface Iadminrepository {
    findEmail(email: string): Promise<IEntrepreneurdata | null>;
    getAllEntrepreneur(): Promise<IEntrepreneurdata[] | null>; 
    getAllInvestor(): Promise<IInvestordata[] | null>;  
}
