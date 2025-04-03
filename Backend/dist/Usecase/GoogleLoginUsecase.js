"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUsecase = void 0;
const tokenauth_1 = require("../Interface/Middleware/tokenauth");
const Index_1 = require("../Infrastructure/Database/Model/Index");
const mongoose_1 = require("mongoose");
class GoogleAuthUsecase {
    constructor(investorrepo, entrepreneurrepo) {
        this.investorrepo = investorrepo;
        this.entrepreneurrepo = entrepreneurrepo;
    }
    async execute(token, user) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const email = payload.email;
            if (user == "entrepreneur") {
                const entrepreneur = await this.entrepreneurrepo.findbyEmail(email);
                if (!entrepreneur) {
                    const entrepreneur = new Index_1.EntrepreneurModel({
                        _id: new mongoose_1.Types.ObjectId(),
                        firstname: payload.given_name,
                        lastname: payload.family_name,
                        email,
                        password: "defaultPassword",
                        confirmpassword: "defaultPassword",
                        phone: "0000000000",
                    });
                    await entrepreneur.save();
                    const tokenPayload = { id: entrepreneur?._id.toString(), email, role: "entrepreneur" };
                    const token = (0, tokenauth_1.generateToken)(tokenPayload);
                    const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
                    return {
                        success: true,
                        entrepreneur,
                        token,
                        refreshToken
                    };
                }
                else {
                    const tokenPayload = { id: entrepreneur?._id.toString(), email, role: "entrepreneur" };
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
            else if (user == "investor") {
                const investor = await this.investorrepo.findbyEmail(email);
                if (!investor) {
                    const investor = new Index_1.InvestorModel({
                        _id: new mongoose_1.Types.ObjectId(),
                        firstname: payload.given_name,
                        lastname: payload.family_name,
                        email,
                        password: "defaultPassword",
                        confirmpassword: "defaultPassword",
                        phone: "0000000000",
                    });
                    await investor.save();
                    const tokenPayload = { id: investor?._id.toString(), email, role: "investor" };
                    const token = (0, tokenauth_1.generateToken)(tokenPayload);
                    const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
                    return {
                        success: true,
                        investor,
                        token,
                        refreshToken
                    };
                }
                else {
                    const tokenPayload = { id: investor?._id.toString(), email, role: "investor" };
                    const token = (0, tokenauth_1.generateToken)(tokenPayload);
                    const refreshToken = (0, tokenauth_1.generateRefreshToken)(tokenPayload);
                    return {
                        success: true,
                        investor,
                        token,
                        refreshToken
                    };
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.GoogleAuthUsecase = GoogleAuthUsecase;
