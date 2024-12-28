import { Router } from "express";
import { InvestorController } from "../Controller/InvestorController";
import { InvestorSignupusecase,investorverifyOtpUsecase ,InvestorLoginUsecase,InvestorProfileUsecas,InvestorProfileEditUsecase} from "../../Usecase"
import { OtpService } from "../../Infrastructure/service/Otpservice";
import { InvestorRepository } from "../../Infrastructure/Repository/InvestorRepository";

const router = Router();


const OtpServiceInstance = new OtpService();
const investorrepositoryInstance = new InvestorRepository();
const investorverifyOtpUsecaseInstance = new investorverifyOtpUsecase(investorrepositoryInstance,OtpServiceInstance);
const InvestorsignupUsecaseInstance = new InvestorSignupusecase(investorrepositoryInstance,OtpServiceInstance);
const InvestorLoginUsecaseInstance = new InvestorLoginUsecase(investorrepositoryInstance)
const InvestorProfileUsecasInstance = new InvestorProfileUsecas(investorrepositoryInstance)
const InvestorProfileEditUsecaseInstance = new InvestorProfileEditUsecase(investorrepositoryInstance)
const InvestoControllerInstance = new InvestorController(InvestorsignupUsecaseInstance,investorverifyOtpUsecaseInstance,InvestorLoginUsecaseInstance,InvestorProfileUsecasInstance,InvestorProfileEditUsecaseInstance)


router.post("/register",(req,res,next)=>{
    InvestoControllerInstance.signup(req,res,next)
})

router.post("/verifyotp",(req,res,next)=>{
    InvestoControllerInstance.verifyOtp(req,res,next)
})


router.post("/login",(req,res,next)=>{
    InvestoControllerInstance.login(req,res,next)
})

router.post("/profile",(req,res,next)=>{
    InvestoControllerInstance.getProfile(req,res,next)
})

router.put("/editprofile",(req,res,next)=>{
    InvestoControllerInstance.editProfile(req,res,next)
})

export {router as InvestorRouter}