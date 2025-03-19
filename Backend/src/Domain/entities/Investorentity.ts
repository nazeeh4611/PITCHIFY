import { Types, ObjectId } from 'mongoose';

export interface IInvestordata {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  password: string;
  confirmpassword: string;
  is_Blocked: boolean;
  is_verified: boolean;
  is_Admin: boolean;
  otp: number;
  tempreg: boolean;
  companydetails: string;
  companyname:string;
  status:string;
  isApproved:boolean; 
  profile:string;
  is_google:boolean;
  savedmodel:Types.ObjectId[];
  premium:{
    plan: Types.ObjectId;
    startDate:Date;   
    endDate: Date;
  };
}

export class Investor implements IInvestordata {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  password: string;
  confirmpassword: string;
  is_Blocked: boolean;
  is_verified: boolean;
  is_Admin: boolean;
  otp: number;
  tempreg: boolean;
  companydetails: string;
  companyname:string;
  status:string;
  isApproved:boolean; 
  profile: string;
  is_google: boolean;
  savedmodel:Types.ObjectId[];
  premium:{
    plan: Types.ObjectId;
    startDate:Date;   
    endDate: Date;
  };
  
  constructor(data: Partial<IInvestordata>) {
    if (!data._id) {
      throw new Error("Missing `_id` in Investor data");
    }
    this._id = new Types.ObjectId();
    this.firstname = data.firstname!;
    this.lastname = data.lastname!;
    this.email = data.email!;
    this.phone = data.phone!;
    this.password = data.password!;
    this.confirmpassword = data.confirmpassword!;
    this.is_Admin = data.is_Admin ?? false;
    this.is_verified = data.is_verified ?? false;
    this.is_Blocked = data.is_Blocked ?? false;
    this.otp = data.otp!;
    this.tempreg = data.tempreg ?? true;
    this.companydetails = data.companydetails ?? "";
    this.companyname = data.companyname ?? "";
    this.status = data.status ?? "not approved";
    this.isApproved = data.isApproved ?? false;
    this.profile = data.profile!;
    this.is_google = data.is_google ?? false;
    this.savedmodel = data.savedmodel ?? [];
    this.premium = data.premium!;
  }

  toInvestorData(): IInvestordata {
    return {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phone: this.phone,
      password: this.password,
      confirmpassword: this.confirmpassword,
      is_Admin: this.is_Admin,
      is_verified: this.is_verified,
      is_Blocked: this.is_Blocked,
      otp: this.otp,
      tempreg: this.tempreg,
      companydetails: this.companydetails,
      companyname:this.companyname,
      status:this.status,
      isApproved:this.isApproved,
      profile:this.profile,
      is_google:this.is_google,
      savedmodel:this.savedmodel,
      premium:this.premium
    };
  }

  async save(): Promise<Investor> {
    console.log("Investor saved to database:", this);
    return this;
  }
}
