import nodemailer from 'nodemailer';
import { genarateOtp } from "../../Infrastructure";
import Entrepreneurmodel from '../Database/Model/Entrepreneurmodel';
export class OtpService {
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_MAIL,
            pass: process.env.APP_PASS
        }
    });

    generateOtp(): number {
        return genarateOtp();
    }

    async sendMail(
        email: string,
        subject: string,
        message: string
    ): Promise<void> {
        const mailOptions = {
            from: process.env.APP_MAIL,
            to: email,
            subject: subject,
            text: message
        };
        await this.transporter.sendMail(mailOptions);
    }

    async verifyOtp(email: string, otp: number): Promise<boolean> {
        try {
            // Fetch the most recent OTP record for the provided email
            const otpRecord = await Entrepreneurmodel.findOne({ email }).sort({ createdAt: -1 }).exec();

            console.log(typeof otpRecord?.otp,typeof otp)
    
            if (!otpRecord) {
                console.error('No OTP record found for this email');
                return false;
            }
    
            if (otpRecord.otp === otp) {
                console.log("matched")
                await Entrepreneurmodel.updateOne(
                    { email }, 
                    { $set: { tempreg: false, is_verified: true } } 
                );
                return true;
            }
    
            console.error('OTP does not match');
            return false;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return false;
        }
    }
    

   

}
