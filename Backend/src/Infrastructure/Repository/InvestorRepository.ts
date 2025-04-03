import { IInvestordata } from "../Database/Model/Investormodel";
import { ChatModel, InvestorModel,BusinessModel, PremiumModel } from "../Database/Model/Index";
import { IInvestorRepository } from "../../Domain/Interface/InvestorInterface";
import { Investor } from "../../Domain/entities";
import { IModelData } from "../../Domain/entities/modelentities";
import {ReviewModel} from "../Database/Model/Index"
import { IChatData } from "../../Domain/entities";
import { Types } from "mongoose";

export class InvestorRepository implements IInvestorRepository {
    async findbyEmail(email: string): Promise<IInvestordata | null> {
        try {
            return await InvestorModel.findOne({ email })
                .populate('premium.plan').populate("savedmodel")
                .exec(); 
        } catch (error) {
            throw new Error(`Error occurred while searching for investor with email: ${email}`);
        }
    }
    

    async getbyId(id: string): Promise<IInvestordata | null> {
        try {
            return await InvestorModel.findOne({ _id: id });
        } catch (error) {
            throw new Error(`Error occurred while retrieving investor by ID: ${id}`);
        }
    }

    async saveinvestor(user: Investor): Promise<IInvestordata> {
        try {
            const createInvestor = new InvestorModel(user);
            return (await createInvestor.save()) as IInvestordata;
        } catch (error) {
            throw new Error("Error occurred while saving investor");
        }
    }

    async update(user: Partial<Investor>): Promise<IInvestordata> {
        try {
            const updatedInvestor = await InvestorModel.findOneAndUpdate(
                { email: user.email },
                {...user},
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

    async verifyinvestor(email: string, companydetails: string,status:string,companyName:string): Promise<IInvestordata> {
        try {
            const verifiedinvestor = await InvestorModel.findOneAndUpdate(
                { email: email },
                { companydetails: companydetails,status:status,comapanyname:companyName },
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


    async modelsbycategory(category: string): Promise<IModelData[] | null> {
        try {
            const models = await BusinessModel.find({ industryFocus: category }).populate('industryFocus');
            return models as unknown as IModelData[];
        } catch (error) {
            console.error(`Error in modelsbycategory:`, error);
            return null;
        }
    }

    async modelDetails(id:string):Promise<IModelData | null>{
        try {
            const details = await BusinessModel.findById(id).populate('uploadedentrepreneur')
            return details as unknown as IModelData
        } catch (error) {
            return null
        }
    }

    async addpremium(id: string, startdate: Date, enddate: Date, email: string): Promise<IInvestordata | null> {
        try {
            const result = await InvestorModel.findOneAndUpdate(
                { email: email }, 
                { 
                    $set: {
                        'premium.plan': id, 
                        'premium.startDate': startdate,
                        'premium.endDate': enddate 
                    }
                },
                { new: true }
            );

            await PremiumModel.findByIdAndUpdate(
                id,
                { $inc: { users: 1 } }, 
                { new: true }
            );
    
            return result; 
        } catch (error) {
            console.error("Error updating premium:", error);
            return null; 
        }
    }
    
    
    async addreview( modelId: string,rating: number,review: string,email: string ): Promise<IModelData | null> {
        try {
          const investor = await this.findbyEmail(email);
          if (!investor) throw new Error("Investor not found");
      
          const investorId = investor._id;
      
          const newReview = await ReviewModel.create({
            rate: rating,
            review,
            rated_by: investorId,
            modelid: modelId,
          });
      
      
          const updatedModel = await BusinessModel.findOneAndUpdate(
            { _id: modelId },
            { $push: { reviews: newReview._id } },
            { new: true } 
          ).lean<IModelData>();
      
          return updatedModel;
        } catch (error) {
          console.error("Error adding review:", error);
          return null;
        }
      }
      async getReciever(id: string): Promise<IChatData | null> {
        try {
            
            const chatData = await ChatModel.findOne({ _id: id })
                .populate('entrepreneur') 
                .populate('investor');   
            
            return chatData;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async savemodel(email:string,modelId:string):Promise<IInvestordata | null>{
        try {
            const investordata = await InvestorModel.findOneAndUpdate(
                {email:email},
                {$push:{savedmodel:modelId}},
                {new:true}
            )

            console.log(investordata,"in repo")
            return investordata
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async unsavemodel(email: string, modelId: string): Promise<IInvestordata | null> {
        try {
            const investordata = await InvestorModel.findOneAndUpdate(
                { email: email },
                { $pull: { savedmodel: modelId } },
                { new: true }
            );
    
            console.log(investordata, "in repo");
            return investordata;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    

    async exclusiveModel(): Promise<IModelData[] | null> {
        try {
            const modelData = await BusinessModel.find()
                .sort({ createdAt: -1 }) 
                .limit(10)
                .lean<IModelData[]>();
    
            return modelData;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
    
    
    
      
    

}