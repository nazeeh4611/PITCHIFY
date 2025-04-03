"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUsecase = void 0;
const mongoose_1 = require("mongoose");
const entrepreneurentities_1 = require("../Domain/entities/entrepreneurentities");
const hashpass_1 = require("../Infrastructure/Utils/hashpass");
class signupUsecase {
    constructor(entrepreneurRepo, otpservice) {
        this.entrepreneurRepo = entrepreneurRepo;
        this.otpservice = otpservice;
    }
    async execute(firstname, lastname, email, phone, password, confirmpassword, res) {
        if (!firstname || !lastname || !email || !phone || !password || !confirmpassword) {
            return { message: "invalid inputs" };
        }
        if (password !== confirmpassword) {
            return { message: "Password not match" };
        }
        const existEmail = await this.entrepreneurRepo.findbyEmail(email);
        if (existEmail) {
            return { message: "this email already exist" };
        }
        const hashedpass = await (0, hashpass_1.hashpass)(password);
        const otp = this.otpservice.generateOtp();
        const entrepreneur = new entrepreneurentities_1.Entrepreneur({
            _id: new mongoose_1.Types.ObjectId(),
            firstname,
            lastname,
            email,
            phone,
            password: hashedpass,
            confirmpassword: hashedpass,
            otp
        });
        const message = `YOUR OTP CODE IS  ${otp}`;
        const subject = `Enter Otp for Your Registration`;
        await this.otpservice.sendMail(email, subject, message);
        const entrepreneurData = entrepreneur.toIEntrepreneurData();
        const savedentrepreneurData = await this.entrepreneurRepo.saveentrepreneur(entrepreneurData);
        const savedentrepreneur = new entrepreneurentities_1.Entrepreneur(savedentrepreneurData);
        return savedentrepreneur;
    }
}
exports.signupUsecase = signupUsecase;
