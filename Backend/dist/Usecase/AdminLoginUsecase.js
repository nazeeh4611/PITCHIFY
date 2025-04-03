"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginUsecase = void 0;
const hashpass_1 = require("../Infrastructure/Utils/hashpass");
const tokenauth_1 = require("../Interface/Middleware/tokenauth");
class AdminLoginUsecase {
    constructor(loginRepository) {
        this.loginRepository = loginRepository;
    }
    async execute(email, password) {
        if (!email || !password) {
            return { success: false, message: "email and password required" };
        }
        const admin = await this.loginRepository.findEmail(email);
        console.log(admin?.is_Admin, "issiissi");
        if (admin?.is_Admin) {
            console.log("inside");
            const ispassValid = await (0, hashpass_1.verifypass)(password, admin.password);
            if (!ispassValid) {
                return { success: false, message: "invalid password" };
            }
            const tokenPayload = { id: admin._id.toString(), email, role: "admin" };
            const token = (0, tokenauth_1.generateToken)(tokenPayload);
            const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
            return {
                admin,
                token,
                refreshToken
            };
        }
        return { success: false, message: "you are not admin" };
    }
}
exports.AdminLoginUsecase = AdminLoginUsecase;
