import { Types } from "mongoose";
import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"
import {BusinessModel} from "../Infrastructure/Database/Model"
import { Model } from "../Domain/entities";

export class AddmodelUsecase {
    constructor(private entrepreneurrepo: IEntrepreneurRepository) {}

    async execute(businessName: string, tagline: string, industryFocus: Types.ObjectId, targetAudience: string, problemStatement: string, solution: string, teamExpertise: string, useOfFunds: string,location:string, marketOpportunities: string, fundingGoal: string, email: string, pitchvideo: string) {
        const entrepreneur = await this.entrepreneurrepo.findbyEmail(email)
        const businessModel = new BusinessModel({
            _id: new Types.ObjectId(),
            businessName,
            tagline,
            industryFocus,
            targetAudience,
            problemStatement,
            solution,
            teamexpertise: teamExpertise,
            useOfFunds,
            location,
            marketOpportunities,
            fundinggoal: fundingGoal,
            pitchvideo,
            uploadedentrepreneur:entrepreneur?._id
        });


        const id = businessModel._id

        const updateentrepreneur = await this.entrepreneurrepo.savemodel(email,id)


        await businessModel.save();  
       
        return updateentrepreneur 
    }
}
