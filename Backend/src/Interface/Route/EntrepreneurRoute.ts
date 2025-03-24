import { Router } from "express";
import { EntrepreneurController } from "../Controller/EntrepreneurController";
 import { signupUsecase,
  VerifyOtpUsecase,
  EntrepreneurLoginUsecase,
  EntrepreneuProfileUsecase,
  EntreprenuerEditProfileUsecase,
  GetCategoryUsecase,
  AddmodelUsecase,
  GetmodelUsecase,
  ModeldetailsUsecase,
  Editmodelusecase,
  Getplanusecase,
  entrepreneurpremiumusecase,
  EntrepreneurGetChatUsecase,
  EntrepreneurGetMessageUsecase,
  EntrepreneurMessageUseCase,
  GetInvestorUsecase,
  EntrepreneurCreateChatUseCase,
  GoogleAuthUsecase,
  
} from "../../Usecase";
import { OtpService } from '../../Infrastructure/service/Otpservice';
import { S3Client } from "@aws-sdk/client-s3"; 
import multer from "multer";
import multerS3 from "multer-s3";
import { entrepreneurRepository } from '../../Infrastructure/Repository';
import { ChatRepositoryImpl } from '../../Infrastructure/Repository/ChatRepository';
import { AdminRepository } from "../../Infrastructure/Repository";
import { InvestorRepository} from "../../Infrastructure/Repository";
import {MessageRepositoryImpl} from "../../Infrastructure/Repository/MessageRepository"

const router = Router();

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
      bucket: "modelvideo",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
  });

  const s3Client2 = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  
  const upload2 = multer({
    storage: multerS3({
      s3: s3Client2,
      bucket: "pitchify-profile-image", 
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
  });
  

const entrepreneurRepositoryInstance = new entrepreneurRepository();
const adminrepositoryInstance = new AdminRepository()
const investorrepositoryinstance = new InvestorRepository()
const ChatRepositoryInstance = new ChatRepositoryImpl()
const MessageRepositoryInstance = new MessageRepositoryImpl()
const Otpserviceinstance = new OtpService();
const signupusecaseinstance = new signupUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const verifyotpusecase = new VerifyOtpUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const EntrepreneurLoginUsecaseInstance = new EntrepreneurLoginUsecase(entrepreneurRepositoryInstance);
const EntrepreneurprofileInstance = new EntrepreneuProfileUsecase(entrepreneurRepositoryInstance);
const EntreprenuerEditProfileUsecaseInstance = new EntreprenuerEditProfileUsecase(entrepreneurRepositoryInstance)
const GetCategoryUsecaseInstance = new GetCategoryUsecase(adminrepositoryInstance)
const AddmodelUsecaseInstance = new AddmodelUsecase(entrepreneurRepositoryInstance)
const getmodelusecaseInstance = new GetmodelUsecase(entrepreneurRepositoryInstance)
const ModeldetailsUsecaseInstance = new ModeldetailsUsecase(entrepreneurRepositoryInstance)
const EditmodelusecaseInstance = new Editmodelusecase(entrepreneurRepositoryInstance)
const GetplanusecaseInstance = new Getplanusecase(adminrepositoryInstance)
const entrepreneurpremiumusecaseInstance = new entrepreneurpremiumusecase(entrepreneurRepositoryInstance)
const EntrepreneurGetChatUsecaseInstance = new EntrepreneurGetChatUsecase(ChatRepositoryInstance,entrepreneurRepositoryInstance)
const EntrepreneurCreateChatUseCaseInstance = new EntrepreneurCreateChatUseCase(ChatRepositoryInstance,entrepreneurRepositoryInstance)

const EntrepreneurGetMessageUsecaseInstance = new EntrepreneurGetMessageUsecase(MessageRepositoryInstance)
const GetInvestorUsecaseInstance = new GetInvestorUsecase(adminrepositoryInstance)
const GoogleAuthUsecaseInstance = new GoogleAuthUsecase(investorrepositoryinstance,entrepreneurRepositoryInstance)
const EntrepreneurMessageUseCaseInstance = new EntrepreneurMessageUseCase(MessageRepositoryInstance,ChatRepositoryInstance,entrepreneurRepositoryInstance)
const EntrepreneurControllerInstance = new EntrepreneurController(
     signupusecaseinstance,
     verifyotpusecase,
     EntrepreneurLoginUsecaseInstance,
     EntrepreneurprofileInstance,
     EntreprenuerEditProfileUsecaseInstance,
     GetCategoryUsecaseInstance,
     AddmodelUsecaseInstance,
     getmodelusecaseInstance,
     ModeldetailsUsecaseInstance,
     EditmodelusecaseInstance,
     GetplanusecaseInstance,
     entrepreneurpremiumusecaseInstance,
     EntrepreneurGetChatUsecaseInstance,
     EntrepreneurGetMessageUsecaseInstance,
     EntrepreneurMessageUseCaseInstance,
     GetInvestorUsecaseInstance,
     EntrepreneurCreateChatUseCaseInstance,
     GoogleAuthUsecaseInstance,
     );
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

router.put("/editprofile", upload2.single("profile"), (req, res,next) => {
  console.log("myyyy")
  EntrepreneurControllerInstance.editProfile(req,res,next);
});


router.get("/category",(req,res,next)=>{
    EntrepreneurControllerInstance.getcategory(req,res,next)
})

router.post('/add-model',upload.single('file'),(req,res,next)=>{
    EntrepreneurControllerInstance.addmodel(req,res,next)
})

router.post("/models",(req,res,next)=>{
   EntrepreneurControllerInstance.getmodal(req,res,next)
})
router.get("/model-details/:id", (req, res, next) => {
  EntrepreneurControllerInstance.getmodeldetails(req, res, next);
});

router.put("/model-details/:id",upload.single('file'),(req,res,next)=>{
  EntrepreneurControllerInstance.editmodel(req,res,next)
})

router.post('/create-payment-intent',(req,res,next)=>{
  EntrepreneurControllerInstance.subscription(req,res,next)
})

router.get("/get-plan",(req,res,next)=>{
  EntrepreneurControllerInstance.getplan(req,res,next)
})

router.get("/get-chat/:email",(req,res,next)=>{
 EntrepreneurControllerInstance.getChat(req,res,next)
})

router.get("/get-messages/:chatId",(req,res,next)=>{
  EntrepreneurControllerInstance.getMessage(req,res,next)
})

router.post("/send-message",(req,res,next)=>{
  EntrepreneurControllerInstance.sendMessage(req,res,next)
})


router.post("/google-login",(req,res,next)=>{
  EntrepreneurControllerInstance.googleLogin(req,res,next)
})

router.get("/get-investors",(req,res,next)=>{
  EntrepreneurControllerInstance.getInvestors(req,res,next)
})

router.post("/create-chat",(req,res,next)=>{
  EntrepreneurControllerInstance.createChat(req,res,next)
})




export { router as entrepreneurrouter };
