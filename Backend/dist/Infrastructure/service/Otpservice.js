"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const __1 = require("..");
const Entrepreneurmodel_1 = __importDefault(require("../Database/Model/Entrepreneurmodel"));
const Index_1 = require("../Database/Model/Index");
class OtpService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_MAIL,
                pass: process.env.APP_PASS
            }
        });
    }
    generateOtp() {
        return (0, __1.genarateOtp)();
    }
    async sendMail(email, subject, message) {
        const mailOptions = {
            from: process.env.APP_MAIL,
            to: email,
            subject: subject,
            text: message
        };
        await this.transporter.sendMail(mailOptions);
    }
    async verifyOtp(email, otp, user) {
        try {
            if (user === "Entrepreneur") {
                const otpRecord = await Entrepreneurmodel_1.default.findOne({ email }).sort({ createdAt: -1 }).exec();
                if (!otpRecord) {
                    console.error('No OTP record found for this email');
                    return false;
                }
                if (otpRecord.otp === otp) {
                    await Entrepreneurmodel_1.default.updateOne({ email }, { $set: { tempreg: false, is_verified: true } });
                    return true;
                }
                console.error('OTP does not match');
                return false;
            }
            else if (user === "Investor") {
                const otpRecord = await Index_1.InvestorModel.findOne({ email }).sort({ createdAt: -1 }).exec();
                if (!otpRecord) {
                    console.error('No OTP record found for this email');
                    return false;
                }
                if (otpRecord.otp === otp) {
                    await Index_1.InvestorModel.updateOne({ email }, { $set: { tempreg: false, is_verified: true } });
                    return true;
                }
                console.error('OTP does not match');
                return false;
            }
            else {
                console.error('Invalid user type');
                return false;
            }
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
            return false;
        }
    }
}
exports.OtpService = OtpService;
