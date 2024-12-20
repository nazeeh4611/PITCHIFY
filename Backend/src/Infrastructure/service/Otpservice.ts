import nodemailer from 'nodemailer';
import { genarateOtp } from "../../Infrastructure";

export class OtpService {
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_MAIL,
            pass: process.env.APP_PASS
        }
    });

    private otpStorage = new Map<string, number>(); // Temporary in-memory OTP storage

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

    // Add the `verifyOtp` method
    async verifyOtp(email: string, otp: number): Promise<boolean> {
        const storedOtp = this.otpStorage.get(email);
        if (storedOtp && storedOtp === otp) {
            this.otpStorage.delete(email); // Remove OTP after verification
            return true;
        }
        return false;
    }

    // Add method to save OTP for verification
    saveOtp(email: string, otp: number): void {
        this.otpStorage.set(email, otp);
    }
}
