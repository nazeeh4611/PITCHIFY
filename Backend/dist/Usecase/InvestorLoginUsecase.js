"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorLoginUsecase = void 0;
const tokenauth_1 = require("../Interface/Middleware/tokenauth");
const hashpass_1 = require("../Infrastructure/Utils/hashpass");
class InvestorLoginUsecase {
    constructor(loginRepository) {
        this.loginRepository = loginRepository;
    }
    async execute(email, password) {
        if (!email || !password) {
            return { success: false, message: "email and password required" };
        }
        const Investor = await this.loginRepository.findbyEmail(email);
        if (!Investor) {
            return { success: false, message: "invalid email" };
        }
        if (Investor.is_Blocked == true) {
            return { success: false, message: "acount is bloacked" };
        }
        const ispassValid = await (0, hashpass_1.verifypass)(password, Investor.password);
        if (!ispassValid) {
            return { success: false, message: "Invalid pasword" };
        }
        const tokenPayload = { id: Investor._id.toString(), email, role: "investor" };
        const token = (0, tokenauth_1.generateToken)(tokenPayload);
        const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
        return {
            success: true,
            Investor,
            token,
            refreshToken
        };
    }
}
exports.InvestorLoginUsecase = InvestorLoginUsecase;
