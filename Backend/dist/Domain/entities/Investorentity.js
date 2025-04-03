"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investor = void 0;
const mongoose_1 = require("mongoose");
class Investor {
    constructor(data) {
        if (!data._id) {
            throw new Error("Missing `_id` in Investor data");
        }
        this._id = new mongoose_1.Types.ObjectId();
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.confirmpassword = data.confirmpassword;
        this.is_Admin = data.is_Admin ?? false;
        this.is_verified = data.is_verified ?? false;
        this.is_Blocked = data.is_Blocked ?? false;
        this.otp = data.otp;
        this.tempreg = data.tempreg ?? true;
        this.companydetails = data.companydetails ?? "";
        this.companyname = data.companyname ?? "";
        this.status = data.status ?? "not approved";
        this.isApproved = data.isApproved ?? false;
        this.profile = data.profile;
        this.is_google = data.is_google ?? false;
        this.savedmodel = data.savedmodel ?? [];
        this.premium = data.premium;
    }
    toInvestorData() {
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
            companyname: this.companyname,
            status: this.status,
            isApproved: this.isApproved,
            profile: this.profile,
            is_google: this.is_google,
            savedmodel: this.savedmodel,
            premium: this.premium
        };
    }
    async save() {
        console.log("Investor saved to database:", this);
        return this;
    }
}
exports.Investor = Investor;
