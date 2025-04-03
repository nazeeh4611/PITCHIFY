"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entrepreneur = void 0;
const mongoose_1 = require("mongoose");
class Entrepreneur {
    constructor(data) {
        if (!data._id) {
            throw new Error("Missing `_id` in Entrepreneur data");
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
        this.businessModels = data.businessModels ?? [];
        this.profile = data.profile;
        this.is_google = data.is_google ?? false;
        this.premium = data.premium;
    }
    toIEntrepreneurData() {
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
            businessModels: this.businessModels,
            profile: this.profile,
            is_google: this.is_google,
            premium: this.premium,
        };
    }
    async save() {
        console.log("Entrepreneur saved to database:", this);
        return this;
    }
    addBusinessModel(businessModelId) {
        this.businessModels.push(businessModelId);
    }
    removeBusinessModel(businessModelId) {
        this.businessModels = this.businessModels.filter((id) => !id.equals(businessModelId));
    }
}
exports.Entrepreneur = Entrepreneur;
