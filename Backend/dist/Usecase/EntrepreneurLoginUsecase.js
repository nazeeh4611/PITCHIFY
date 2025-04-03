"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurLoginUsecase = void 0;
const tokenauth_1 = require("../Interface/Middleware/tokenauth");
const hashpass_1 = require("../Infrastructure/Utils/hashpass");
class EntrepreneurLoginUsecase {
    constructor(loginRepository) {
        this.loginRepository = loginRepository;
    }
    async execute(email, password) {
        if (!email || !password) {
            return { success: false, message: "email and password required" };
        }
        const entrepreneur = await this.loginRepository.findbyEmail(email);
        if (!entrepreneur) {
            return { success: false, message: "invalid email" };
        }
        if (entrepreneur.is_Blocked == true) {
            return { success: false, message: "acount is blocked" };
        }
        const ispassValid = await (0, hashpass_1.verifypass)(password, entrepreneur.password);
        if (!ispassValid) {
            return { success: false, message: "Invalid pasword" };
        }
        const tokenPayload = { id: entrepreneur._id.toString(), email, role: "entrepreneur" };
        const token = (0, tokenauth_1.generateToken)(tokenPayload);
        const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
        return {
            success: true,
            entrepreneur,
            token,
            refreshToken
        };
    }
}
exports.EntrepreneurLoginUsecase = EntrepreneurLoginUsecase;
