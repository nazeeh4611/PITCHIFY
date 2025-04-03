"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorSignupusecase = void 0;
const mongoose_1 = require("mongoose");
const Investorentity_1 = require("../Domain/entities/Investorentity");
const hashpass_1 = require("../Infrastructure/Utils/hashpass");
class InvestorSignupusecase {
    constructor(investorRepo, otpService) {
        this.investorRepo = investorRepo;
        this.otpService = otpService;
    }
    async execute(firstname, lastname, email, phone, password, confirmpassword, res) {
        if (!firstname || !lastname || !email || !phone || !password || !confirmpassword) {
            return { message: "invalid inputs" };
        }
        if (password !== confirmpassword) {
            return { message: "Password not match" };
        }
        const existEmail = await this.investorRepo.findbyEmail(email);
        if (existEmail) {
            return { message: "this email already exist" };
        }
        const hashedpass = await (0, hashpass_1.hashpass)(password);
        const otp = this.otpService.generateOtp();
        const investor = new Investorentity_1.Investor({
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
        await this.otpService.sendMail(email, subject, message);
        const entrepreneurData = investor.toInvestorData();
        const savedentrepreneurData = await this.investorRepo.saveinvestor(entrepreneurData);
        const savedentrepreneur = new Investorentity_1.Investor(savedentrepreneurData);
        return savedentrepreneur;
    }
}
exports.InvestorSignupusecase = InvestorSignupusecase;
