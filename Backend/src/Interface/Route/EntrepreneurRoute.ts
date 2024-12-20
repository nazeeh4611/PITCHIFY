import { Router } from "express";
import { EntrepreneurController } from "../Controller/EntreprenuerController";
import { signupUsecase } from "../../Usecase/SignupUsecase";
import { VerifyOtpUsecase } from "../../Usecase/OtpUsecase";
import { OtpService } from '../../Infrastructure/service/Otpservice';
import { entrepreneurRepository } from '../../Infrastructure/Repository';

const router = Router();

const entrepreneurRepositoryInstance = new entrepreneurRepository();
const Otpserviceinstance = new OtpService();
const signupusecaseinstance = new signupUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const verifyotpusecase = new VerifyOtpUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const EntrepreneurControllerInstance = new EntrepreneurController(signupusecaseinstance, verifyotpusecase);

router.post("/register", (req, res, next) => {
    EntrepreneurControllerInstance.signup(req, res, next);
});

router.post("/verifyotp", (req, res, next) => {
    EntrepreneurControllerInstance.verifyotp(req, res, next);
});

export { router as entrepreneurrouter };
