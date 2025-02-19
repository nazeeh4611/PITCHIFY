import { Types, Document, Schema, model, ObjectId } from "mongoose";

export interface IInvestordata extends Document {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    password: string;
    confirmpassword: string;
    is_Admin: boolean;
    is_verified: boolean;
    is_Blocked: boolean;
    otp: number;
    tempreg: boolean;
    companydetails: string;
    companyname:string;
    status:string;
    isApproved:boolean;
    premium:{
        plan: Types.ObjectId;
        startDate:Date;
        endDate: Date;
      };
}

const InvestorSchema = new Schema<IInvestordata>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
        password: { type: String, required: true },
        confirmpassword: { type: String, required: true },
        is_Admin: { type: Boolean, default: false },
        is_Blocked: { type: Boolean, default: false },
        is_verified: { type: Boolean, default: false },
        otp: { type: Number },
        tempreg: { type: Boolean, default: true },
        companydetails: { type: String, default: "" },
        companyname:{type:String,default:""},
        status:{type:String,default:"not approved"},
        isApproved:{type:Boolean,default:false},
        premium:{
            plan: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan" },
            startDate: { type: Date },
            endDate: { type: Date },
        },
    },
    {
        timestamps: true
    }
);

export default model<IInvestordata>("Investor", InvestorSchema);
