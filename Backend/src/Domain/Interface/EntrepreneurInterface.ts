import { Types } from "mongoose";
import { IEntrepreneurdata } from "../../Infrastructure/Database/Model/Entrepreneurmodel";
import { Entrepreneur } from "../entities/entrepreneurentities";
import { IModelData } from "../../Infrastructure/Database/Model/ModelsModel";
import { Model } from "../entities/modelentities";

export interface IEntrepreneurRepository {
  getbyId(id: string): Promise<IEntrepreneurdata | null>;
  saveentrepreneur(user: Entrepreneur): Promise<IEntrepreneurdata>;
  findbyEmail(email: string): Promise<IEntrepreneurdata | null>;
  update(user: Partial<Entrepreneur>): Promise<IEntrepreneurdata>;
  savemodel(email: string, model: Types.ObjectId): Promise<IEntrepreneurdata>;
  getmodel(email: string): Promise<IEntrepreneurdata | null>;
  modeldetails(id: Types.ObjectId): Promise<IModelData | null>;
  editmodel(model: Partial<Model>, id: Types.ObjectId): Promise<IModelData>;
  addpremium(id:string,startdate:Date,enddate:Date,email:string):Promise<IEntrepreneurdata | null>
}
