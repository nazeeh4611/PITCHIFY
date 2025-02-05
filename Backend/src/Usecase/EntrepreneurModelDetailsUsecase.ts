import { Types } from "mongoose";
import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"



export class ModeldetailsUsecase{
    constructor(
     private entrpreneurrepo:IEntrepreneurRepository
    ){}

    async execute(id: Types.ObjectId) {
        try {
            const result = await this.entrpreneurrepo.modeldetails(id);
            return result;
        } catch (error) {
            console.error("Error fetching entrepreneur model:", error);
            throw new Error("Failed to fetch entrepreneur model.");
        }
    }
    
}