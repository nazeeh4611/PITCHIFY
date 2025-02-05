import { Types, Document, Schema, model } from "mongoose";

export interface IReview extends Document {
  rate: number;
  review: string;
  rated_by: Types.ObjectId;
  modelid: Types.ObjectId; 
  
}

const ReviewSchema = new Schema<IReview>(
  {
    rate: { type: Number, required: true },
    review: { type: String, required: true },
    rated_by: { type: Schema.Types.ObjectId, required: true,red:"Investor" },
    modelid: { type: Schema.Types.ObjectId, required: true }, 
  },
  {
    timestamps: true,
  }
);

export default model<IReview>("Review", ReviewSchema);
