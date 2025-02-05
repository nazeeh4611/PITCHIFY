import { Types, Document, Schema, model } from "mongoose";

export interface ISubscriptionPlan extends Document {
    planName: string;
  description: string;
  planPrice: number;
  Duration: number; // Duration in months, for example
  isActive: boolean;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    planName: { type: String, required: true },
    description: { type: String, required: true },
    planPrice: { type: Number, required: true },
    Duration: { type: Number, required: true }, 
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);
