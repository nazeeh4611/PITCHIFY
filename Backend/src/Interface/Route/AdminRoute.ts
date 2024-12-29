import { Router } from "express";
import { AdminController } from "../Controller/AdminController";
import {GetEntrpreneurUsecase,GetInvestorUsecase,AdminLoginUsecase} from "../../Usecase"

import {AdminRepository} from "../../Infrastructure/Repository"
import authMiddleware from "../Middleware/Auth"; // Import the middleware



const router = Router();


const AdminRepositoryInstance = new AdminRepository();
const AdminLoginUsecaseInstance = new AdminLoginUsecase(AdminRepositoryInstance);
const GetEntrepreneurUsecaseInstance = new GetEntrpreneurUsecase(AdminRepositoryInstance);
const GetInvestorUsecaseInstance = new GetInvestorUsecase(AdminRepositoryInstance);
const AdminControllerInstance = new AdminController(AdminLoginUsecaseInstance,GetInvestorUsecaseInstance,GetEntrepreneurUsecaseInstance);

router.post("/login",(req,res,next)=>{
    AdminControllerInstance.adminLogin(req,res,next)
})


router.get("/investorlist",authMiddleware(['admin']),(req,res,next)=>{
    AdminControllerInstance.getInvestor(req,res,next)
})


router.get("/entrepreneurlist",authMiddleware(['admin']),(req,res,next)=>{
    AdminControllerInstance.getEntrepreneur(req,res,next)
})

export {router as AdminRouter}