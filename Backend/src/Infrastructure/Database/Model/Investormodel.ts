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
    status:string;
    isApproved:boolean;
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
        status:{type:String,default:"not approved"},
        isApproved:{type:Boolean,default:false},
    },
    {
        timestamps: true
    }
);

export const investorModel = model<IInvestordata>("Investor", InvestorSchema);
