import { Types ,ObjectId} from 'mongoose';

export interface IInvestordata {
  _id: Types.ObjectId; // Ensure `_id` is required
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  password: string;
  confirmpassword: string;
  is_Blocked: boolean;
  is_verified: boolean;
  is_Admin: boolean;
  otp:number;
  tempreg:boolean;
}

export class Investor implements IInvestordata {
  _id: Types.ObjectId; // `_id` is now required here
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

  constructor(data: Partial<IInvestordata>) {
    if (!data._id) {
      throw new Error("Missing `_id` in Investor data"); // Ensure `_id` is always provided
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
    this.tempreg = data.tempreg??true;
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
      otp:this.otp,
      tempreg:this.tempreg
    };
  }

  async save(): Promise<Investor> {
    // Simulate saving to the database
    console.log("Investor saved to database:", this);
    return this;
  }
}