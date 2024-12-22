import { Request, Response, NextFunction } from 'express';
import { signupUsecase ,VerifyOtpUsecase,EntrepreneurLoginUsecase,EntrepreneuProfileUsecase} from '../../Usecase'


export class EntrepreneurController {
    constructor(
        private signupusecase: signupUsecase,
        private verifyotpusecase: VerifyOtpUsecase,
        private loginusecase : EntrepreneurLoginUsecase,
        private profileusecase: EntrepreneuProfileUsecase
    ) {}

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { firstname, lastname, phone, email, password, confirmpassword } = req.body;


        try {
            const entrepreneur = await this.signupusecase.execute(
                firstname,
                lastname,
                email,
                phone,
                password,
                confirmpassword,
                res
            );

            res.status(200).json({ success: true, entrepreneur });
            
        } catch (error) {
            console.error("Error during signup:", error);
            next(error);
        }
    }

    async verifyotp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp, emaildata } = req.body;
            
            // const decodedEmail = decodeURIComponent(emaildata); 
            // const bytes = CryptoJS.AES.decrypt(decodedEmail, "emailsecret");
            // const email = bytes.toString(CryptoJS.enc.Utf8);
    
             const email = emaildata
            if (!email) {
                throw new Error("Failed to decrypt email or email is empty.");
            }
    
            const response = await this.verifyotpusecase.execute(Number(otp), email);
    
    
            if(response){
                const token = response.token
                res.status(200).json({success:true,message:"otp verified",token})
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
            next(error);
        }
    }
    


    async login(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
      const {email,password} = req.body

      try {

       const response =  await this.loginusecase.execute(email,password)


       if(response){

        const token = response.token
        res.status(200).json({sucess:true,token})
       }
        
      } catch (error) {
        
      }
    }


    async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            
            const response = await this.profileusecase.execute(email);
            console.log("Response:", response);
    
            if (response) {
                res.status(200).json({
                    message: "Profile fetched successfully",
                    entrepreneur: response.entrepreneur,
                });
            } else {
                res.status(404).json({ message: "Profile not found" });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ message: "Internal server error" });
            next(error);
        }
    }
    

}
