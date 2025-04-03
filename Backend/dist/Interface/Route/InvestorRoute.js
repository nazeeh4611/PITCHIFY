"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorRouter = void 0;
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const InvestorController_1 = require("../Controller/InvestorController");
const Usecase_1 = require("../../Usecase");
const Otpservice_1 = require("../../Infrastructure/service/Otpservice");
const InvestorRepository_1 = require("../../Infrastructure/Repository/InvestorRepository");
const ChatRepository_1 = require("../../Infrastructure/Repository/ChatRepository");
const MessageRepository_1 = require("../../Infrastructure/Repository/MessageRepository");
const AdminRepository_1 = require("../../Infrastructure/Repository/AdminRepository");
const Repository_1 = require("../../Infrastructure/Repository");
const router = (0, express_1.Router)();
exports.InvestorRouter = router;
// @ts-ignore
// Create multer instance with storage and file filter
const s3Client = new client_s3_1.S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Client,
        bucket: "pitchifyinvestordetails",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});
const s3Client2 = new client_s3_1.S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const upload2 = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Client2,
        bucket: "pitchify-profile-image",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});
const OtpServiceInstance = new Otpservice_1.OtpService();
const investorrepositoryInstance = new InvestorRepository_1.InvestorRepository();
const entrepreneurRepositoryInstance = new Repository_1.entrepreneurRepository();
const ChatRepositoryImplInstance = new ChatRepository_1.ChatRepositoryImpl();
const MessageRepositoryImplInstance = new MessageRepository_1.MessageRepositoryImpl();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository();
const investorverifyOtpUsecaseInstance = new Usecase_1.investorverifyOtpUsecase(investorrepositoryInstance, OtpServiceInstance);
const InvestorsignupUsecaseInstance = new Usecase_1.InvestorSignupusecase(investorrepositoryInstance, OtpServiceInstance);
const InvestorLoginUsecaseInstance = new Usecase_1.InvestorLoginUsecase(investorrepositoryInstance);
const InvestorProfileUsecasInstance = new Usecase_1.InvestorProfileUsecas(investorrepositoryInstance);
const InvestorProfileEditUsecaseInstance = new Usecase_1.InvestorProfileEditUsecase(investorrepositoryInstance);
const InvestorverifyusecaseInstance = new Usecase_1.Investorverifyusecase(investorrepositoryInstance);
const investorModelsUsecaseInstance = new Usecase_1.investorModelsUsecase(investorrepositoryInstance);
const InvestormodeldetailsInstance = new Usecase_1.Investormodeldetails(investorrepositoryInstance);
const investordetailsusecaseInstance = new Usecase_1.investordetailsusecase(investorrepositoryInstance);
const GetplanusecaseInstance = new Usecase_1.Getplanusecase(AdminRepositoryInstance);
const InvestorsubscritptionusecaseInstance = new Usecase_1.Investorsubscritptionusecase(investorrepositoryInstance);
const ReviewusecaseInstance = new Usecase_1.Reviewusecase(investorrepositoryInstance);
const MessageUseCaseInstance = new Usecase_1.MessageUseCase(MessageRepositoryImplInstance, ChatRepositoryImplInstance, investorrepositoryInstance);
const GoogleAuthUsecaseInstance = new Usecase_1.GoogleAuthUsecase(investorrepositoryInstance, entrepreneurRepositoryInstance);
const getRecieverInstance = new Usecase_1.getReciever(investorrepositoryInstance);
const getAllchatusecaseInstance = new Usecase_1.getAllchatusecase(ChatRepositoryImplInstance);
const CreateChatUseCaseInstance = new Usecase_1.CreateChatUseCase(ChatRepositoryImplInstance, investorrepositoryInstance);
const savemodelUsecaseInstance = new Usecase_1.savemodelUsecase(investorrepositoryInstance);
const UnsavemodelUsecaseInstance = new Usecase_1.UnsavemodelUsecase(investorrepositoryInstance);
const exclusivemodelUsecaseInstance = new Usecase_1.exclusivemodelUsecase(investorrepositoryInstance);
const InvestoControllerInstance = new InvestorController_1.InvestorController(InvestorsignupUsecaseInstance, investorverifyOtpUsecaseInstance, InvestorLoginUsecaseInstance, InvestorProfileUsecasInstance, InvestorProfileEditUsecaseInstance, InvestorverifyusecaseInstance, investordetailsusecaseInstance, investorModelsUsecaseInstance, InvestormodeldetailsInstance, GetplanusecaseInstance, InvestorsubscritptionusecaseInstance, ReviewusecaseInstance, CreateChatUseCaseInstance, MessageUseCaseInstance, getRecieverInstance, getAllchatusecaseInstance, GoogleAuthUsecaseInstance, savemodelUsecaseInstance, UnsavemodelUsecaseInstance, exclusivemodelUsecaseInstance);
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
router.get('/investor-details', (req, res, next) => {
    InvestoControllerInstance.InvestorDetails(req, res, next);
});
router.post("/models", (req, res, next) => {
    InvestoControllerInstance.GetModels(req, res, next);
});
router.get("/model-details/:id", (req, res, next) => {
    InvestoControllerInstance.modelDetails(req, res, next);
});
router.post('/create-payment-intent', (req, res, next) => {
    InvestoControllerInstance.subscription(req, res, next);
});
router.get("/get-plan", (req, res, next) => {
    InvestoControllerInstance.getPlans(req, res, next);
});
router.post("/submit-rating", (req, res, next) => {
    InvestoControllerInstance.rating(req, res, next);
});
router.post("/create-chat", (req, res, next) => {
    InvestoControllerInstance.createChat(req, res, next);
});
router.get('/chat/:chatId/messages', (req, res, next) => {
    InvestoControllerInstance.message(req, res, next);
});
router.get(`/get-reciever/:id`, (req, res, next) => {
    InvestoControllerInstance.getMessageReciever(req, res, next);
});
router.get("/get-chat/:id", (req, res, next) => {
    console.log("this be the equest inside route");
    InvestoControllerInstance.getChat(req, res, next);
});
router.post("/send-message", (req, res, next) => {
    console.log("this be the send message request");
    InvestoControllerInstance.addMessage(req, res, next);
});
router.get("/get-messages/:chatId", (req, res, next) => {
    console.log("the response is getting");
    InvestoControllerInstance.message(req, res, next);
});
router.post("/google-login", (req, res, next) => {
    InvestoControllerInstance.googleLogin(req, res, next);
});
router.post("/save-model", (req, res, next) => {
    InvestoControllerInstance.savemodel(req, res, next);
});
router.post("/unsave-model", (req, res, next) => {
    InvestoControllerInstance.unsavemodel(req, res, next);
});
router.get('/exclusivemodels', (req, res, next) => {
    console.log("modelllelleleeleel");
    InvestoControllerInstance.exclusivemodel(req, res, next);
});
