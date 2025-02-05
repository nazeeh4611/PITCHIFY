import { IInvestordata } from "../Domain/entities";
import { IInvestorRepository } from "../Domain/Interface/InvestorInterface";
import {generateToken,generateRefreshToken} from "../Interface/Middleware/tokenauth"
import {OtpService} from "../Infrastructure/service/Otpservice"

class ApplicationError extends Error{
    constructor(message:string,public statusCode:number){
        super(message);
        this.name = "ApplicationError"
    }
}

export class investorverifyOtpUsecase {
    constructor(
        private investorrepository:IInvestorRepository,
        private otpservice: { verifyOtp: (email: string, otp: number,user:string) => Promise<boolean> } 
            ) {}

    async execute(
        otp:number,
        email:string
        ): Promise<{ success: boolean; token?: string; refreshToken?: string; user?: IInvestordata }> {

           if(!otp || !email){

            throw new ApplicationError("Otp and email is not provided",400)
           }

           const user = "Investor"

           const isOtpValid = await this.otpservice.verifyOtp(email,otp,user);

             if(!isOtpValid){
                throw new Error("invalid otp")
             }
             const investor = await this.investorrepository.findbyEmail(email);
            if (!investor || !investor._id) {
            throw new Error("Invalid email");
            }

            await investor.save();


            const tokenPayload = {id:investor._id.toString(),email,role:"investor"}
            const token = generateToken(tokenPayload)
            const refreshToken = generateRefreshToken(tokenPayload)

            return{
                success:true,
                token,
                refreshToken,
                user:investor
            }
        }
        
        }