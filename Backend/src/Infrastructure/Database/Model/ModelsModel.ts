import { Schema, model, Types, Document } from "mongoose";

export interface IModelData extends Document {
    _id: Types.ObjectId;
    businessName: string;
    tagline: string;
    fundinggoal: string;
    industryFocus: Types.ObjectId;
    problemStatement: string;
    targetAudience: string;
    solution: string;
    teamexpertise: string;
    postedDate:Date;
    pitchvideo: string;
    useOfFunds: string;
    location:string;
    marketOpportunities: string;
    uploadedentrepreneur:Types.ObjectId;
    reviews:[Types.ObjectId]
}

const ModelSchema = new Schema<IModelData>(
    {
        businessName: { type: String, required: true },
        tagline: { type: String, required: true },
        fundinggoal: { type: String, required: true },
        industryFocus: { type: Schema.Types.ObjectId, ref: "Category" },
        problemStatement: { type: String, required: true },
        solution: { type: String, required: true },
        targetAudience: { type: String, required: true },
        marketOpportunities: { type: String, required: true },
        useOfFunds: { type: String },
        location:{type:String},
        teamexpertise: { type: String },
        postedDate: { type: Date, default: Date.now },
        pitchvideo: { type: String, required: true , },
        uploadedentrepreneur:{type:Schema.Types.ObjectId,ref:"Entrepreneur"},

        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }] 

    },
    {
        timestamps: true,
    }
);

export default model<IModelData>("BusinessModel", ModelSchema);
