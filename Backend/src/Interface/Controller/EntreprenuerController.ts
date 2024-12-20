import { Request, Response, NextFunction } from 'express';
import { signupUsecase } from '../../Usecase/SignupUsecase';
import { VerifyOtpUsecase } from '../../Usecase/OtpUsecase';
import * as CryptoJS from 'crypto-js';

export class EntrepreneurController {
    constructor(
        private signupusecase: signupUsecase,
        private verifyotpusecase: VerifyOtpUsecase
    ) {}

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { firstname, lastname, phone, email, password, confirmpassword } = req.body;


        try {
            const user = await this.signupusecase.execute(
                firstname,
                lastname,
                email,
                phone,
                password,
                confirmpassword,
                res
            );

            res.status(200).json({ success: true, user });
            
        } catch (error) {
            console.error("Error during signup:", error);
            next(error);
        }
    }

    async verifyotp(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { otp, emaildata } = req.body;
        
        try {
            const bytes = CryptoJS.AES.decrypt(emaildata, "emailsecret");
            const email = bytes.toString(CryptoJS.enc.Utf8);
    
    
            if (!email) {
                throw new Error("Failed to decrypt email or email is empty.");
            }
    
            const response = await this.verifyotpusecase.execute(otp, email);
    
            if (response.success) {
                res.cookie('userToken', response.token, {
                    maxAge: 250000,
                    httpOnly: true,
                    secure: true
                });
                res.status(200).json({ success: true, message: 'OTP verified successfully' });
            } else {
                res.status(400).json({ success: false, message: 'Invalid OTP or email' });
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            next(error);
        }
    }
    



}
