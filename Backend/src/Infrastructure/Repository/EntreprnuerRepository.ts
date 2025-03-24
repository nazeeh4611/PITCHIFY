import { Types } from "mongoose";
import Entrepreneurmodel, { IEntrepreneurdata } from "../Database/Model/Entrepreneurmodel";
import BusinessModel, { IModelData } from "../Database/Model/ModelsModel";
import { IEntrepreneurRepository } from "../../Domain/Interface/EntrepreneurInterface";
import { Entrepreneur } from "../../Domain/entities/entrepreneurentities";
import { Model } from "../../Domain/entities/modelentities";
import { PremiumModel } from "../Database/Model";

export class entrepreneurRepository implements IEntrepreneurRepository {
  async findbyEmail(email: string): Promise<IEntrepreneurdata | null> {
    return Entrepreneurmodel.findOne({ email }).populate('premium.plan') 
    .exec() as Promise<IEntrepreneurdata | null>;
  }

  async getbyId(id: string): Promise<IEntrepreneurdata | null> {
    try {
      return Entrepreneurmodel.findById(id) as Promise<IEntrepreneurdata | null>;
    } catch (error) {
      console.error("Error in getbyId:", error);
      throw new Error("Error while fetching entrepreneur by ID.");
    }
  }

  async saveentrepreneur(user: Entrepreneur): Promise<IEntrepreneurdata> {
    try {
      const createEntrepreneur = new Entrepreneurmodel(user);
      return createEntrepreneur.save() as Promise<IEntrepreneurdata>;
    } catch (error) {
      console.error("Error in saveentrepreneur:", error);
      throw new Error("Error while saving entrepreneur.");
    }
  }

  async update(user: Partial<Entrepreneur>): Promise<IEntrepreneurdata> {
    try {

      console.log(user,"this be the user in update repo")
      const updatedEntrepreneur = await Entrepreneurmodel.findOneAndUpdate(
        { email: user.email, },
        { ...user },
        { new: true }
      );
      if (!updatedEntrepreneur) {
        throw new Error("Entrepreneur not found.");
      }

      return updatedEntrepreneur as IEntrepreneurdata;
    } catch (error) {
      console.error("Error in update:", error);
      throw new Error("Error while updating entrepreneur.");
    }
  }

  async savemodel(email: string, model: Types.ObjectId): Promise<IEntrepreneurdata> {
    try {
      const updatedEntrepreneur = await Entrepreneurmodel.findOneAndUpdate(
        { email },
        { $push: { businessModels: model } },
        { new: true }
      );

      if (!updatedEntrepreneur) {
        throw new Error("Entrepreneur not found.");
      }

      return updatedEntrepreneur as IEntrepreneurdata;
    } catch (error) {
      console.error("Error in savemodel:", error);
      throw new Error("Error while saving model.");
    }
  }

  async getmodel(email: string): Promise<IEntrepreneurdata | null> {
    try {
      const populatedModel = await Entrepreneurmodel.findOne({ email })
        .populate({
          path: "businessModels",
          populate: [
            {
              path: "reviews",  
              model: "Review",  
              populate: {
                path: "rated_by",  
                model: "Investor", 
              },
            },
          ],
        })
        .exec();
  
      return populatedModel as IEntrepreneurdata | null;
    } catch (error) {
      console.error("Error in getmodel:", error);
      throw new Error("Error while fetching models.");
    }
  }
  

  async modeldetails(id: Types.ObjectId): Promise<IModelData | null> {
    try {
      const businessModel = await BusinessModel.findById(id)
        .populate("industryFocus")
        .exec();

      return businessModel as IModelData | null;
    } catch (error) {
      console.error("Error in modeldetails:", error);
      throw new Error("Error while fetching model details.");
    }
  }

  async editmodel(model: Partial<Model>, id: Types.ObjectId): Promise<IModelData> {
    try {
      const updatedModel = await BusinessModel.findByIdAndUpdate(
        id,
        { ...model },
        { new: true }
      );

      if (!updatedModel) {
        throw new Error("Model not found.");
      }

      return updatedModel as IModelData;
    } catch (error) {
      console.error("Error in editmodel:", error);
      throw new Error("Error while editing model.");
    }
  }

  async addpremium(id: string, startdate: Date, enddate: Date, email: string): Promise<IEntrepreneurdata | null> {
    try {
        const result = await Entrepreneurmodel.findOneAndUpdate(
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



}
