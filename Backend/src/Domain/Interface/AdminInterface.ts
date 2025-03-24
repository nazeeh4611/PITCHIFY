import { IInvestordata } from "../../Infrastructure/Database/Model/Investormodel";
import { IEntrepreneurdata } from "../../Infrastructure/Database/Model/Entrepreneurmodel";
import { ICategoryData, IModelData } from "../../Domain/entities";
import { IPremium } from "../../Domain/entities";
import { Category } from "../../Domain/entities";
import { Types } from "mongoose";
export interface Iadminrepository {
    findEmail(email: string): Promise<IEntrepreneurdata | null>;
    getAllEntrepreneur(): Promise<IEntrepreneurdata[] | null>; 
    getAllInvestor(): Promise<IInvestordata[] | null>;  
    blockUnblockEntrepreneur(email:string):Promise<IEntrepreneurdata|null>
    findCategory(name: string): Promise<ICategoryData | null>;
    getAllCategory():Promise<ICategoryData[] | null>
    updatecategory(category: Partial<Category>): Promise<ICategoryData | null>;
    unlistcategory(id:Types.ObjectId):Promise<ICategoryData|null>
    investorDetails(id:string):Promise<IInvestordata | null>
    investorupdatestatus(status:string,email:string):Promise<IInvestordata |null>
    getAllpremium():Promise<IPremium[] | null>
    entrepreneurModels(id:string):Promise<any>
    modelDetails(id:string):Promise<IModelData | null>
    DashboardDetails():Promise<{ 
        entrepreneurCount: number; 
        investorCount: number; 
        entrepreneurPremium: number; 
        investorPremium: number; 
        entrepreneurNonPremium:number;
        investorNonPremium:number;
      }>
}
