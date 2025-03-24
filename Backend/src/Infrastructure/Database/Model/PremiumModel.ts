import { Types, Document, Schema, model } from "mongoose";

export interface ISubscriptionPlan extends Document {
    planName: string;
  description: string;
  planPrice: number;
  Duration: number; 
  isActive: boolean;
  users:number;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    planName: { type: String, required: true },
    description: { type: String, required: true },
    planPrice: { type: Number, required: true },
    Duration: { type: Number, required: true }, 
    isActive: { type: Boolean, default: true },
    users:{type:Number,default:0}
  },
  {
    timestamps: true,
  }
);

export default model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);
