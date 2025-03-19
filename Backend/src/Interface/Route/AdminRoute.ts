import { Router } from "express";
import { S3Client } from "@aws-sdk/client-s3"; 
import multer from "multer";
import multerS3 from "multer-s3";
const path = require("path");
import { AdminController } from "../Controller/AdminController";
import {GetEntrpreneurUsecase,
    GetInvestorUsecase,
    AdminLoginUsecase,
    EntrepreneurBlockusecase,
    CategoryUsecase,
    GetCategoryUsecase,
    EditcategoryUsecase,
    categoryListingUsecase,
    AdminInvestorDetailsusecase,
    InvestorstatusUsecase,
    Addplanusecase,
    Getplanusecase,
    AdminEntrepreneurModels,
    Adminmodeldetails
  } from "../../Usecase"

import {AdminRepository} from "../../Infrastructure/Repository"
import authMiddleware from "../Middleware/Auth"; 

  
const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  
  const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: "categoryimage",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
  });
  
  
const router = Router();


const AdminRepositoryInstance = new AdminRepository();
const AdminLoginUsecaseInstance = new AdminLoginUsecase(AdminRepositoryInstance);
const GetEntrepreneurUsecaseInstance = new GetEntrpreneurUsecase(AdminRepositoryInstance);
const GetInvestorUsecaseInstance = new GetInvestorUsecase(AdminRepositoryInstance);
const EntrepreneurBlockusecaseInstance = new EntrepreneurBlockusecase(AdminRepositoryInstance)
const CategoryUsecaseInstance = new CategoryUsecase(AdminRepositoryInstance)
const GetCategoryUsecaseInstance = new GetCategoryUsecase(AdminRepositoryInstance)
const EditcategoryUsecaseInstance = new EditcategoryUsecase(AdminRepositoryInstance)
const categoryListingUsecaseInstance = new categoryListingUsecase(AdminRepositoryInstance)
const AdminInvestorDetailsusecaseInstance = new AdminInvestorDetailsusecase(AdminRepositoryInstance)
const InvestorstatusUsecaseInstance = new InvestorstatusUsecase(AdminRepositoryInstance)
const AddplanusecaseInstance = new Addplanusecase()
const GetplanusecaseInstance = new Getplanusecase(AdminRepositoryInstance)
const AdminEntrepreneurModelsInstance = new AdminEntrepreneurModels(AdminRepositoryInstance)
const AdminmodeldetailsInstance = new Adminmodeldetails(AdminRepositoryInstance)
const AdminControllerInstance = new AdminController(AdminLoginUsecaseInstance,
    GetInvestorUsecaseInstance,
    GetEntrepreneurUsecaseInstance,
    EntrepreneurBlockusecaseInstance,
    CategoryUsecaseInstance,
    GetCategoryUsecaseInstance,
    EditcategoryUsecaseInstance,
    categoryListingUsecaseInstance,
    AdminInvestorDetailsusecaseInstance,
    InvestorstatusUsecaseInstance,
    AddplanusecaseInstance,
    GetplanusecaseInstance,
    AdminEntrepreneurModelsInstance,
    AdminmodeldetailsInstance
    );

router.post("/login",(req,res,next)=>{
    AdminControllerInstance.adminLogin(req,res,next)
})


router.get("/investorlist",authMiddleware(['admin']),(req,res,next)=>{
    AdminControllerInstance.getInvestor(req,res,next)
})


router.get("/entrepreneurlist",authMiddleware(['admin']),(req,res,next)=>{
    AdminControllerInstance.getEntrepreneur(req,res,next)
})

router.post("/entrepreneurblock",authMiddleware(['admin']),(req,res,next)=>{
    AdminControllerInstance.blockEntrepreneur(req,res,next)
})

router.post("/add-category",upload.single("image"),(req,res,next)=>{
    AdminControllerInstance.AddCategory(req,res,next)
})

router.get("/category",(req,res,next)=>{
    AdminControllerInstance.GetCategory(req,res,next)
})
router.put("/edit-category",upload.single("image"),(req,res,next)=>{
   AdminControllerInstance.EditCategory(req,res,next)
})
router.put("/categorylist",(req,res,next)=>{
    AdminControllerInstance.listcategory(req,res,next)
 })

 router.get("/investor-details",(req,res,next)=>{
  AdminControllerInstance.InvestorDetails(req,res,next)
 })


 router.post("/investor-verify",(req,res,next)=>{
  AdminControllerInstance.InvestorVerify(req,res,next)
 })

 router.post("/add-plan",(req,res,next)=>{
  AdminControllerInstance.addPlan(req,res,next)
 })

 router.get("/premium-plan",(req,res,next)=>{
  AdminControllerInstance.getPlans(req,res,next)
 })

 router.get("/entrepreneurmodels/:id",(req,res,next)=>{
  AdminControllerInstance.GetentreprenuerModel(req,res,next)
 })

 router.get("/model-details/:id",(req,res,next)=>{
  console.log("inroute ")
  AdminControllerInstance.modelDetails(req,res,next)
 })
export {router as AdminRouter}