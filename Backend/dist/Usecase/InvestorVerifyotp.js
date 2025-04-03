"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investorverifyOtpUsecase = void 0;
const tokenauth_1 = require("../Interface/Middleware/tokenauth");
class ApplicationError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApplicationError";
    }
}
class investorverifyOtpUsecase {
    constructor(investorrepository, otpservice) {
        this.investorrepository = investorrepository;
        this.otpservice = otpservice;
    }
    async execute(otp, email) {
        if (!otp || !email) {
            throw new ApplicationError("Otp and email is not provided", 400);
        }
        const user = "Investor";
        const isOtpValid = await this.otpservice.verifyOtp(email, otp, user);
        if (!isOtpValid) {
            throw new Error("invalid otp");
        }
        const investor = await this.investorrepository.findbyEmail(email);
        if (!investor || !investor._id) {
            throw new Error("Invalid email");
        }
        await investor.save();
        const tokenPayload = { id: investor._id.toString(), email, role: "investor" };
        const token = (0, tokenauth_1.generateToken)(tokenPayload);
        const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
        return {
            success: true,
            token,
            refreshToken,
            user: investor
        };
    }
}
exports.investorverifyOtpUsecase = investorverifyOtpUsecase;
