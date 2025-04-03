import { IInvestordata } from "../Database/Model/Investormodel";
import Investormodel from "../Database/Model/Investormodel";
import {PremiumModel} from "../Database/Model/Index";
import Entrepreneurmodel from "../Database/Model/Entrepreneurmodel";
import { IEntrepreneurdata } from "../Database/Model/Entrepreneurmodel";
import { Iadminrepository } from "../../Domain/Interface/AdminInterface";
import { ICategoryData } from "../../Domain/entities";
import {CategoryModel} from "../Database/Model/Index"
import {BusinessModel} from "../Database/Model/Index"
import { Category } from "../../Domain/entities";
import { IPremium} from "../../Domain/entities";
import { IModelData} from "../../Domain/entities";
import { Types } from "mongoose";

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
            const investors = await Investormodel.find().lean<IInvestordata[]>();
            return investors.length > 0 ? investors : null;
        } catch (error) {
            throw new Error("Error occurred in getAllInvestor: ");
        }
    }
    async investorDetails(id:string): Promise<IInvestordata | null> {
        try {
          const investorDetails = await Investormodel.findById(id);
          return investorDetails;
        } catch (error) {
          console.error("Error fetching investor details:", error);
          return null;
        }
      }

      async investorupdatestatus(status:string,email:string):Promise<IInvestordata |null>{
         try {
            const investorData = await Investormodel.findOneAndUpdate(
                {email:email},
                {status:status},
                {new:true}
                );

                return investorData
            
         } catch (error) {
            console.error(error)
            return null
         }
      }
      

  
    async  blockUnblockEntrepreneur(email: string): Promise<IEntrepreneurdata | null> {
    try {
      const entrepreneur = await Entrepreneurmodel.findOne({ email });
  
      if (entrepreneur) {
        entrepreneur.is_Blocked = !entrepreneur.is_Blocked;
  
        await entrepreneur.save();
  
        return entrepreneur;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error blocking/unblocking entrepreneur:', error);
      return null;
    }
}

async findCategory(name: string): Promise<ICategoryData | null> {
  try {
      const category = await CategoryModel.findOne({ categoryname: name }).lean<ICategoryData>();
      return category || null;
  } catch (error) {
      console.error("Error occurred in findCategory:", error);
      return null;
  }
}

async getAllCategory(): Promise<ICategoryData[] | null> {
  try {
      const categories = await CategoryModel.find().lean<ICategoryData[]>();
      return categories.length > 0 ? categories : null;
  } catch (error) {
      throw new Error("Error occurred in get categories: " + error);
  }
}

async updatecategory(category: Partial<Category>): Promise<ICategoryData | null> {

  if (!category._id || !category.categoryname || !category.image) {
      throw new Error("Missing required fields: id, name, or image");
  }

  try {

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
          category._id, 
          { categoryname: category.categoryname, image: category.image },
          { new: true } 
      ).lean<ICategoryData>();

      return updatedCategory || null;
  } catch (error) {
      console.error("Error occurred in updatecategory:", error);
      throw error;
  }
}
async unlistcategory(id: Types.ObjectId): Promise<ICategoryData | null> {
  if (!id) {
      console.error("Error occurred: No ID provided.");
      return null;
  }

  try {
      const updatecategory = await CategoryModel.findById(id);

      if (updatecategory) {
          updatecategory.is_Listed = !updatecategory.is_Listed;

          await updatecategory.save();
          return updatecategory; 
      }

      return null; 
  } catch (error) {
      console.error("Error occurred in unlistcategory:", error);
      return null; 
  }
}


async getAllpremium(): Promise<IPremium[] | null> {
  try {
    const plans = await PremiumModel.find().lean<IPremium[]>();
    return plans.length > 0 ? plans : null;
  } catch (error) {
    console.error("Error occurred in getAllpremium:", error);
    return null;
  }
}
async entrepreneurModels(id: string){
  try {
    const models = await BusinessModel.find({ uploadedentrepreneur: id }).lean();
    console.log(models, "in repository");
    return models; 
  } catch (error) {
    console.error("Error fetching entrepreneur models:", error);
    return []; 
  }
}

async modelDetails(id:string):Promise<IModelData | null>{
  try {
      const details = await BusinessModel.findById(id)
      return details as unknown as IModelData
  } catch (error) {
      return null
  }
}
async  DashboardDetails(): Promise<{ 
  entrepreneurCount: number; 
  investorCount: number; 
  entrepreneurPremium: number; 
  investorPremium: number; 
  entrepreneurNonPremium: number;
  investorNonPremium: number;
}> {
  try {
    const entrepreneurCount = await Entrepreneurmodel.countDocuments();
    const investorCount = await Investormodel.countDocuments();

    const entrepreneurPremium = await Entrepreneurmodel.countDocuments({ 
      "premium.plan": { $exists: true, $ne: null } 
    });

    const investorPremium = await Investormodel.countDocuments({
      "premium.plan": { $exists: true, $ne: null }
    });

    const entrepreneurNonPremium = entrepreneurCount - entrepreneurPremium;
    const investorNonPremium = investorCount - investorPremium;

    return {
      entrepreneurCount,
      investorCount,
      entrepreneurPremium,
      investorPremium,
      entrepreneurNonPremium,
      investorNonPremium
    };
  } catch (error) {
    console.error("Error in DashboardDetails:", error);
    throw new Error("Failed to fetch dashboard details");
  }
}



}