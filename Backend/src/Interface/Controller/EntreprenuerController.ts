import { Request, Response, NextFunction } from 'express';
import { signupUsecase ,VerifyOtpUsecase,EntrepreneurLoginUsecase} from '../../Usecase'


export class EntrepreneurController {
    constructor(
        private signupusecase: signupUsecase,
        private verifyotpusecase: VerifyOtpUsecase,
        private loginusecase : EntrepreneurLoginUsecase
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

       console.log(response)

       if(response){

        const token = response.token
        console.log(token,"here the tokn")
        res.status(200).json({sucess:true,token})
       }
        
      } catch (error) {
        
      }
    }

}
