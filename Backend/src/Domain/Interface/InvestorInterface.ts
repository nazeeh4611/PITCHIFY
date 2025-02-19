import { IChatData, IModelData, Investor } from "../entities";
import {IInvestordata} from "../../Infrastructure/Database/Model/Investormodel"
import { Types } from "mongoose";

export interface IInvestorRepository {
    getbyId(id: string): Promise<IInvestordata | null>;
    saveinvestor(user: Investor): Promise<IInvestordata>;
    findbyEmail(email: string): Promise<IInvestordata | null>;
    update(user: Partial<Investor>): Promise<IInvestordata>;
    verifyinvestor(email: string, companydetails: string,status:string,companyName:string): Promise<IInvestordata>;
    modelsbycategory(category:string):Promise<IModelData[] | null>
    modelDetails(id:string):Promise<IModelData | null>
    addpremium(id:string,startdate:Date,enddate:Date,email:string):Promise<IInvestordata | null>
    addreview(modelId:string,rating:number,review:string,email:string):Promise< IModelData | null>
    getReciever(id:string):Promise<IChatData | null>
}
