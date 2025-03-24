import { Router } from "express";
import { S3Client } from "@aws-sdk/client-s3"; 
import multer from "multer";
import multerS3 from "multer-s3";
import { InvestorController } from "../Controller/InvestorController";
import Stripe from 'stripe';

import { 
  InvestorSignupusecase, 
  investorverifyOtpUsecase, 
  InvestorLoginUsecase, 
  InvestorProfileUsecas, 
  InvestorProfileEditUsecase, 
  Investorverifyusecase,
  investordetailsusecase,
  investorModelsUsecase,
  Investormodeldetails ,
  Getplanusecase,
  Investorsubscritptionusecase,
  Reviewusecase,
  CreateChatUseCase,
  MessageUseCase,
  getReciever,
  getAllchatusecase,
  GoogleAuthUsecase,
  savemodelUsecase,
  UnsavemodelUsecase,
  exclusivemodelUsecase
  
} from "../../Usecase";
import { OtpService } from "../../Infrastructure/service/Otpservice";
import { InvestorRepository } from "../../Infrastructure/Repository/InvestorRepository";
import {ChatRepositoryImpl} from "../../Infrastructure/Repository/ChatRepository"
import {MessageRepositoryImpl} from "../../Infrastructure/Repository/MessageRepository"
import { AdminRepository } from "../../Infrastructure/Repository/AdminRepository";
import { entrepreneurRepository } from "../../Infrastructure/Repository";


const router = Router();

// @ts-ignore



// Create multer instance with storage and file filter
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
    bucket: "pitchifyinvestordetails",
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

const OtpServiceInstance = new OtpService();
const investorrepositoryInstance = new InvestorRepository();
const entrepreneurRepositoryInstance = new entrepreneurRepository()
const ChatRepositoryImplInstance = new ChatRepositoryImpl()
const MessageRepositoryImplInstance = new MessageRepositoryImpl()
const AdminRepositoryInstance = new AdminRepository();
const investorverifyOtpUsecaseInstance = new investorverifyOtpUsecase(investorrepositoryInstance, OtpServiceInstance);
const InvestorsignupUsecaseInstance = new InvestorSignupusecase(investorrepositoryInstance, OtpServiceInstance);
const InvestorLoginUsecaseInstance = new InvestorLoginUsecase(investorrepositoryInstance);
const InvestorProfileUsecasInstance = new InvestorProfileUsecas(investorrepositoryInstance);
const InvestorProfileEditUsecaseInstance = new InvestorProfileEditUsecase(investorrepositoryInstance);
const InvestorverifyusecaseInstance = new Investorverifyusecase(investorrepositoryInstance);
const investorModelsUsecaseInstance = new investorModelsUsecase(investorrepositoryInstance);
const InvestormodeldetailsInstance = new Investormodeldetails(investorrepositoryInstance);
const investordetailsusecaseInstance = new investordetailsusecase(investorrepositoryInstance);
const GetplanusecaseInstance = new Getplanusecase(AdminRepositoryInstance);
const InvestorsubscritptionusecaseInstance = new Investorsubscritptionusecase(investorrepositoryInstance);
const ReviewusecaseInstance = new Reviewusecase(investorrepositoryInstance);
const MessageUseCaseInstance = new MessageUseCase(MessageRepositoryImplInstance,ChatRepositoryImplInstance,investorrepositoryInstance);
const GoogleAuthUsecaseInstance = new GoogleAuthUsecase(investorrepositoryInstance,entrepreneurRepositoryInstance)
const getRecieverInstance = new getReciever(investorrepositoryInstance);
const getAllchatusecaseInstance = new getAllchatusecase(ChatRepositoryImplInstance)
const CreateChatUseCaseInstance = new CreateChatUseCase(
  ChatRepositoryImplInstance,
  investorrepositoryInstance 
);
 const savemodelUsecaseInstance = new savemodelUsecase(investorrepositoryInstance)
 const UnsavemodelUsecaseInstance = new UnsavemodelUsecase(investorrepositoryInstance)
 const exclusivemodelUsecaseInstance = new exclusivemodelUsecase(investorrepositoryInstance)
 const InvestoControllerInstance = new InvestorController(
  InvestorsignupUsecaseInstance,
  investorverifyOtpUsecaseInstance,
  InvestorLoginUsecaseInstance,
  InvestorProfileUsecasInstance,
  InvestorProfileEditUsecaseInstance,
  InvestorverifyusecaseInstance,
  investordetailsusecaseInstance,
  investorModelsUsecaseInstance,
  InvestormodeldetailsInstance,
  GetplanusecaseInstance,
  InvestorsubscritptionusecaseInstance,
  ReviewusecaseInstance,
  CreateChatUseCaseInstance,
  MessageUseCaseInstance,
  getRecieverInstance,
  getAllchatusecaseInstance,
  GoogleAuthUsecaseInstance,
  savemodelUsecaseInstance,
  UnsavemodelUsecaseInstance,
  exclusivemodelUsecaseInstance
);

// Routes
router.post("/register", (req, res, next) => {
  InvestoControllerInstance.signup(req, res, next);
});

router.post("/verifyotp", (req, res, next) => {
  InvestoControllerInstance.verifyOtp(req, res, next);
});

router.post("/login", (req, res, next) => {
  InvestoControllerInstance.login(req, res, next);
});

router.post("/profile", (req, res, next) => {
  InvestoControllerInstance.getProfile(req, res, next);
});

router.put("/editprofile", upload2.single("profile"), (req, res, next) => {
  InvestoControllerInstance.editProfile(req, res, next);
});

router.post("/verifyinvestor", upload.single('file'), (req, res, next) => {
  InvestoControllerInstance.verifyInvestor(req, res, next);
});

router.get('/investor-details',(req,res,next)=>{
  InvestoControllerInstance.InvestorDetails(req,res,next)
})

router.post("/models",(req,res,next)=>{
  InvestoControllerInstance.GetModels(req,res,next)
})

router.get("/model-details/:id",(req,res,next)=>{
  InvestoControllerInstance.modelDetails(req,res,next)
})

router.post('/create-payment-intent',(req,res,next)=>{
  InvestoControllerInstance.subscription(req,res,next)
})

router.get("/get-plan",(req,res,next)=>{
  InvestoControllerInstance.getPlans(req,res,next)  
})

router.post("/submit-rating",(req,res,next)=>{
  InvestoControllerInstance.rating(req,res,next)
})

router.post("/create-chat",(req,res,next)=>{
 InvestoControllerInstance.createChat(req,res,next)
})

router.get('/chat/:chatId/messages', (req, res, next) => {
  InvestoControllerInstance.message(req, res, next);
});

router.get(`/get-reciever/:id`,(req,res,next)=>{
  InvestoControllerInstance.getMessageReciever(req,res,next)
})

router.get("/get-chat/:id",(req,res,next)=>{
  console.log("this be the equest inside route")
 InvestoControllerInstance.getChat(req,res,next)
})

router.post("/send-message",(req,res,next)=>{
  console.log("this be the send message request")
  InvestoControllerInstance.addMessage(req,res,next)
})

router.get("/get-messages/:chatId", (req, res, next) => {
  console.log("the response is getting")
  InvestoControllerInstance.message(req,res,next)
})


router.post("/google-login",(req,res,next)=>{
  InvestoControllerInstance.googleLogin(req,res,next)
})
router.post("/save-model",(req,res,next)=>{
  InvestoControllerInstance.savemodel(req,res,next)
})

router.post("/unsave-model",(req,res,next)=>{
  InvestoControllerInstance.unsavemodel(req,res,next)
})

router.get('/exclusivemodels',(req,res,next)=>{
  console.log("modelllelleleeleel")
  InvestoControllerInstance.exclusivemodel(req,res,next)
})
export { router as InvestorRouter };
