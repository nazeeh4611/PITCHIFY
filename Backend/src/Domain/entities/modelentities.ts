import { Types } from "mongoose";

export interface IModelData {
    _id:Types.ObjectId;
    businessName:string;
    tagline:string;
    fundinggoal:string;
    industryFocus:Types.ObjectId;
    problemStatement:string;
    targetAudience:string;
    solution:string;
    teamexpertise:string;
    postedDate:Date;
    pitchvideo:string;
    useOfFunds:string;
    location:string;
    marketOpportunities:string;
    model:string;
    uploadedentrepreneur:Types.ObjectId;
    reviews:[Types.ObjectId];
}


export class Model implements IModelData {
    _id:Types.ObjectId;
    businessName:string;
    tagline:string;
    fundinggoal:string;
    industryFocus:Types.ObjectId;
    problemStatement:string;
    targetAudience:string;
    solution:string;
    teamexpertise:string;
    postedDate:Date;
    pitchvideo:string;
    useOfFunds:string;
    location:string;
    marketOpportunities:string;
    model: string;
    uploadedentrepreneur:Types.ObjectId;
    reviews:[Types.ObjectId]



    constructor(data:Partial <IModelData>){
        if(!data._id){
            throw new Error("id is missing in modeldata")
        }

        this._id = new Types.ObjectId();
        this.businessName = data.businessName!;
        this.tagline = data.tagline!;
        this.fundinggoal = data.tagline!;
        this.industryFocus = data.industryFocus!;
        this.problemStatement = data.problemStatement!;
        this.solution = data.solution!;
        this.teamexpertise = data.teamexpertise!;
        this.postedDate = data.postedDate!;
        this.pitchvideo = data.pitchvideo!;
        this.useOfFunds = data.useOfFunds!;
        this.location = data.location!;
        this.marketOpportunities = data.marketOpportunities!;
        this.targetAudience = data.targetAudience!;
        this.model = data.model!;
        this.uploadedentrepreneur = data.uploadedentrepreneur!;
        this.reviews = data.reviews!;
    }

    toModelData():IModelData{
        return {
            _id:this._id,
            businessName:this.businessName,
            tagline:this.tagline,
            fundinggoal:this.fundinggoal,
            industryFocus:this.industryFocus,
            targetAudience:this.targetAudience,
            problemStatement:this.problemStatement,
            solution:this.solution,
            teamexpertise:this.teamexpertise,
            postedDate:this.postedDate,
            pitchvideo:this.pitchvideo,
            useOfFunds:this.useOfFunds,
            location:this.location,
            marketOpportunities:this.marketOpportunities,
            model:this.model,
            uploadedentrepreneur:this.uploadedentrepreneur,
            reviews:this.reviews
        };
    }

    async save():Promise<Model>{
        console.log("model saved to the database",this);
        return this
    }
}