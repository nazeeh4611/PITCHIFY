import { Request, Response, NextFunction } from 'express';
import { signupUsecase ,VerifyOtpUsecase,EntrepreneurLoginUsecase,EntrepreneuProfileUsecase,EntreprenuerEditProfileUsecase} from '../../Usecase'


export class EntrepreneurController {
    constructor(
        private signupusecase: signupUsecase,
        private verifyotpusecase: VerifyOtpUsecase,
        private loginusecase : EntrepreneurLoginUsecase,
        private profileusecase: EntrepreneuProfileUsecase,
        private editProfileUsecase:EntreprenuerEditProfileUsecase
    ) {}

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { firstname, lastname, phone, email, password, confirmpassword } = req.body;
         
        if( !firstname|| !lastname|| !phone|| !email|| !password|| !confirmpassword ){
            res.status(404).json({success:false,message:"firstname, lastname, phone, email, password, confirmpassword are required"})
        }

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
            res.status(500).json({sucsess:false,message:"Internal server error"})
            next(error);
        }
    }

    async verifyotp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp, emaildata } = req.body;
            if(!otp || !emaildata){
                res.status(400).json({success:false,message:"otp and email required"})
            }
            
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
            res.status(500).json({sucsess:false,message:"Internal server error"})
            next(error);
        }
    }
    


    async login(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        
        try {
          const {email,password} = req.body
          console.log(email,password)
          if(!email || !password){
            res.status(400).json({success:false,message:"email and password required"})
          }

       const response =  await this.loginusecase.execute(email,password)


       if(response){

        const token = response.token
        res.status(200).json({sucess:true,token})
       }
        
      } catch (error) {
        console.error(error,"error occured in login")
        res.status(500).json({success:false,message:"Internal server error"})
      }
    }


    async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email } = req.body;
            console.log(email)
    
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            
            const response = await this.profileusecase.execute(email);    
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


    async editProfile(req:Request,res:Response,next:NextFunction){
        try {
            const updatedProfile = req.body

            const email = updatedProfile.email
            const phone = updatedProfile.phone
            const fname = updatedProfile.firstname
            const lname = updatedProfile.lastname
            console.log(email,phone,fname,lname,"jhsjhjdhj")
         const response = await this.editProfileUsecase.execute(email,fname,lname,phone)
         console.log(response,"opoppppo")
           res.status(200).json({success:false,message:"data is updated"})
        } catch (error) {
            res.status(500).json({success:false,message:"internal server error"})
        }
    }
    

}


