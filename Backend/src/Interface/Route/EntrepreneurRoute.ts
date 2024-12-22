import { Router } from "express";
import { EntrepreneurController } from "../Controller/EntreprenuerController";
import { signupUsecase,VerifyOtpUsecase,EntrepreneurLoginUsecase,EntrepreneuProfileUsecase} from "../../Usecase";
import { OtpService } from '../../Infrastructure/service/Otpservice';
import { entrepreneurRepository } from '../../Infrastructure/Repository';

const router = Router();

const entrepreneurRepositoryInstance = new entrepreneurRepository();
const Otpserviceinstance = new OtpService();
const signupusecaseinstance = new signupUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const verifyotpusecase = new VerifyOtpUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const EntrepreneurLoginUsecaseInstance = new EntrepreneurLoginUsecase(entrepreneurRepositoryInstance);
const EntrepreneurprofileInstance = new EntrepreneuProfileUsecase(entrepreneurRepositoryInstance);
const EntrepreneurControllerInstance = new EntrepreneurController(signupusecaseinstance, verifyotpusecase,EntrepreneurLoginUsecaseInstance,EntrepreneurprofileInstance);
router.post("/register", (req, res, next) => {
    EntrepreneurControllerInstance.signup(req, res, next);
});

router.post("/verifyotp", (req, res, next) => {
    EntrepreneurControllerInstance.verifyotp(req, res, next);
});


router.post("/login",(req,res,next)=>{
    EntrepreneurControllerInstance.login(req,res,next)
});

router.post("/profile",(req,res,next)=>{
    EntrepreneurControllerInstance.getProfile(req,res,next)
})



export { router as entrepreneurrouter };
