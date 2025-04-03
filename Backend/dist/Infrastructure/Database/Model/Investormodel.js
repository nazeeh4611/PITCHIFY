"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InvestorSchema = new mongoose_1.Schema({
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
    companyname: { type: String, default: "" },
    status: { type: String, default: "not approved" },
    isApproved: { type: Boolean, default: false },
    profile: { type: String },
    is_google: { type: Boolean, default: false },
    savedmodel: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "BusinessModel" }],
    premium: {
        plan: { type: mongoose_1.Schema.Types.ObjectId, ref: "SubscriptionPlan" },
        startDate: { type: Date },
        endDate: { type: Date },
    },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("Investor", InvestorSchema);
