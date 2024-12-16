import { Router } from "express";
import { EntrepreneurController } from "../Controller/EntreprenuerController";

import { signupUsecase } from "../../Usecase/SignupUsecase";

const router = Router()

const signupusecaseinstance = new signupUsecase()
const EntrepreneurControllerInstance = new EntrepreneurController(
    signupusecaseinstance,
);


router.post("/register",(req,res,next)=>{
   EntrepreneurControllerInstance.signup(req,res,next)
})

