"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrepreneurrouter = void 0;
const express_1 = require("express");
const EntrepreneurController_1 = require("../Controller/EntrepreneurController");
const Usecase_1 = require("../../Usecase");
const Otpservice_1 = require("../../Infrastructure/service/Otpservice");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const Repository_1 = require("../../Infrastructure/Repository");
const ChatRepository_1 = require("../../Infrastructure/Repository/ChatRepository");
const Repository_2 = require("../../Infrastructure/Repository");
const Repository_3 = require("../../Infrastructure/Repository");
const MessageRepository_1 = require("../../Infrastructure/Repository/MessageRepository");
const router = (0, express_1.Router)();
exports.entrepreneurrouter = router;
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
        bucket: "modelvideo",
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
const entrepreneurRepositoryInstance = new Repository_1.entrepreneurRepository();
const adminrepositoryInstance = new Repository_2.AdminRepository();
const investorrepositoryinstance = new Repository_3.InvestorRepository();
const ChatRepositoryInstance = new ChatRepository_1.ChatRepositoryImpl();
const MessageRepositoryInstance = new MessageRepository_1.MessageRepositoryImpl();
const Otpserviceinstance = new Otpservice_1.OtpService();
const signupusecaseinstance = new Usecase_1.signupUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const verifyotpusecase = new Usecase_1.VerifyOtpUsecase(entrepreneurRepositoryInstance, Otpserviceinstance);
const EntrepreneurLoginUsecaseInstance = new Usecase_1.EntrepreneurLoginUsecase(entrepreneurRepositoryInstance);
const EntrepreneurprofileInstance = new Usecase_1.EntrepreneuProfileUsecase(entrepreneurRepositoryInstance);
const EntreprenuerEditProfileUsecaseInstance = new Usecase_1.EntreprenuerEditProfileUsecase(entrepreneurRepositoryInstance);
const GetCategoryUsecaseInstance = new Usecase_1.GetCategoryUsecase(adminrepositoryInstance);
const AddmodelUsecaseInstance = new Usecase_1.AddmodelUsecase(entrepreneurRepositoryInstance);
const getmodelusecaseInstance = new Usecase_1.GetmodelUsecase(entrepreneurRepositoryInstance);
const ModeldetailsUsecaseInstance = new Usecase_1.ModeldetailsUsecase(entrepreneurRepositoryInstance);
const EditmodelusecaseInstance = new Usecase_1.Editmodelusecase(entrepreneurRepositoryInstance);
const GetplanusecaseInstance = new Usecase_1.Getplanusecase(adminrepositoryInstance);
const entrepreneurpremiumusecaseInstance = new Usecase_1.entrepreneurpremiumusecase(entrepreneurRepositoryInstance);
const EntrepreneurGetChatUsecaseInstance = new Usecase_1.EntrepreneurGetChatUsecase(ChatRepositoryInstance, entrepreneurRepositoryInstance);
const EntrepreneurCreateChatUseCaseInstance = new Usecase_1.EntrepreneurCreateChatUseCase(ChatRepositoryInstance, entrepreneurRepositoryInstance);
const EntrepreneurGetMessageUsecaseInstance = new Usecase_1.EntrepreneurGetMessageUsecase(MessageRepositoryInstance);
const GetInvestorUsecaseInstance = new Usecase_1.GetInvestorUsecase(adminrepositoryInstance);
const GoogleAuthUsecaseInstance = new Usecase_1.GoogleAuthUsecase(investorrepositoryinstance, entrepreneurRepositoryInstance);
const EntrepreneurMessageUseCaseInstance = new Usecase_1.EntrepreneurMessageUseCase(MessageRepositoryInstance, ChatRepositoryInstance, entrepreneurRepositoryInstance);
const EntrepreneurControllerInstance = new EntrepreneurController_1.EntrepreneurController(signupusecaseinstance, verifyotpusecase, EntrepreneurLoginUsecaseInstance, EntrepreneurprofileInstance, EntreprenuerEditProfileUsecaseInstance, GetCategoryUsecaseInstance, AddmodelUsecaseInstance, getmodelusecaseInstance, ModeldetailsUsecaseInstance, EditmodelusecaseInstance, GetplanusecaseInstance, entrepreneurpremiumusecaseInstance, EntrepreneurGetChatUsecaseInstance, EntrepreneurGetMessageUsecaseInstance, EntrepreneurMessageUseCaseInstance, GetInvestorUsecaseInstance, EntrepreneurCreateChatUseCaseInstance, GoogleAuthUsecaseInstance);
router.post("/register", (req, res, next) => {
    EntrepreneurControllerInstance.signup(req, res, next);
});
router.post("/verifyotp", (req, res, next) => {
    EntrepreneurControllerInstance.verifyotp(req, res, next);
});
router.post("/login", (req, res, next) => {
    EntrepreneurControllerInstance.login(req, res, next);
});
router.post("/profile", (req, res, next) => {
    EntrepreneurControllerInstance.getProfile(req, res, next);
});
router.put("/editprofile", upload2.single("profile"), (req, res, next) => {
    console.log("myyyy");
    EntrepreneurControllerInstance.editProfile(req, res, next);
});
router.get("/category", (req, res, next) => {
    EntrepreneurControllerInstance.getcategory(req, res, next);
});
router.post('/add-model', upload.single('file'), (req, res, next) => {
    EntrepreneurControllerInstance.addmodel(req, res, next);
});
router.post("/models", (req, res, next) => {
    EntrepreneurControllerInstance.getmodal(req, res, next);
});
router.get("/model-details/:id", (req, res, next) => {
    EntrepreneurControllerInstance.getmodeldetails(req, res, next);
});
router.put("/model-details/:id", upload.single('file'), (req, res, next) => {
    EntrepreneurControllerInstance.editmodel(req, res, next);
});
router.post('/create-payment-intent', (req, res, next) => {
    EntrepreneurControllerInstance.subscription(req, res, next);
});
router.get("/get-plan", (req, res, next) => {
    EntrepreneurControllerInstance.getplan(req, res, next);
});
router.get("/get-chat/:email", (req, res, next) => {
    EntrepreneurControllerInstance.getChat(req, res, next);
});
router.get("/get-messages/:chatId", (req, res, next) => {
    EntrepreneurControllerInstance.getMessage(req, res, next);
});
router.post("/send-message", (req, res, next) => {
    EntrepreneurControllerInstance.sendMessage(req, res, next);
});
router.post("/google-login", (req, res, next) => {
    EntrepreneurControllerInstance.googleLogin(req, res, next);
});
router.get("/get-investors", (req, res, next) => {
    EntrepreneurControllerInstance.getInvestors(req, res, next);
});
router.post("/create-chat", (req, res, next) => {
    EntrepreneurControllerInstance.createChat(req, res, next);
});
