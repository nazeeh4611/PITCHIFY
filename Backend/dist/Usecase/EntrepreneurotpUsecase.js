"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpUsecase = void 0;
const tokenauth_1 = require("../Interface/Middleware/tokenauth");
class ApplicationError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApplicationError";
    }
}
class VerifyOtpUsecase {
    constructor(entrepreneurRepository, OtpSevice) {
        this.entrepreneurRepository = entrepreneurRepository;
        this.OtpSevice = OtpSevice;
    }
    async execute(otp, email) {
        // Validate input
        if (!otp || !email) {
            throw new ApplicationError("OTP and email are required", 400);
        }
        const user = "Entrepreneur";
        const isOtpValid = await this.OtpSevice.verifyOtp(email, otp, user);
        if (!isOtpValid) {
            throw new ApplicationError("Invalid or expired OTP", 401);
        }
        const entrepreneur = await this.entrepreneurRepository.findbyEmail(email);
        if (!entrepreneur || !entrepreneur._id) {
            throw new ApplicationError("No user found or invalid user data", 404);
        }
        await entrepreneur.save();
        const tokenPayload = { id: entrepreneur._id.toString(), email, role: "entrepreneur" };
        const token = (0, tokenauth_1.generateToken)(tokenPayload);
        const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
        return {
            success: true,
            token,
            refreshToken,
            user: entrepreneur
        };
    }
}
exports.VerifyOtpUsecase = VerifyOtpUsecase;
