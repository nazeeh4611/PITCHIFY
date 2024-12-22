import { Router } from "express";
import { InvestorController } from "../Controller/InvestorController";
import { InvestorSignupusecase } from "../../Usecase/InvestorsignupUsecase";
import { investorverifyOtpUsecase } from "../../Usecase/InvestorVerifyotp";
import { OtpService } from "../../Infrastructure/service/Otpservice";
import { InvestorRepository } from "../../Infrastructure/Repository/InvestorRepository";

const router = Router();


const OtpServiceInstance = new OtpService();
const investorrepositoryInstance = new InvestorRepository();
const investorverifyOtpUsecaseInstance = new investorverifyOtpUsecase(investorrepositoryInstance,OtpServiceInstance);
const InvestorsignupUsecaseInstance = new InvestorSignupusecase(investorrepositoryInstance,OtpServiceInstance);
const InvestoControllerInstance = new InvestorController(InvestorsignupUsecaseInstance,investorverifyOtpUsecaseInstance)


router.post("/register",(req,res,next)=>{
    InvestoControllerInstance.signup(req,res,next)
})

router.post("/verifyotp",(req,res,next)=>{
    InvestoControllerInstance.verifyOtp(req,res,next)
})



export {router as InvestorRouter}