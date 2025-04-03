"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path = require("path");
const AdminController_1 = require("../Controller/AdminController");
const Usecase_1 = require("../../Usecase");
const Repository_1 = require("../../Infrastructure/Repository");
const Auth_1 = __importDefault(require("../Middleware/Auth"));
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
        bucket: "categoryimage",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});
const router = (0, express_1.Router)();
exports.AdminRouter = router;
const AdminRepositoryInstance = new Repository_1.AdminRepository();
const AdminLoginUsecaseInstance = new Usecase_1.AdminLoginUsecase(AdminRepositoryInstance);
const GetEntrepreneurUsecaseInstance = new Usecase_1.GetEntrpreneurUsecase(AdminRepositoryInstance);
const GetInvestorUsecaseInstance = new Usecase_1.GetInvestorUsecase(AdminRepositoryInstance);
const EntrepreneurBlockusecaseInstance = new Usecase_1.EntrepreneurBlockusecase(AdminRepositoryInstance);
const CategoryUsecaseInstance = new Usecase_1.CategoryUsecase(AdminRepositoryInstance);
const GetCategoryUsecaseInstance = new Usecase_1.GetCategoryUsecase(AdminRepositoryInstance);
const EditcategoryUsecaseInstance = new Usecase_1.EditcategoryUsecase(AdminRepositoryInstance);
const categoryListingUsecaseInstance = new Usecase_1.categoryListingUsecase(AdminRepositoryInstance);
const AdminInvestorDetailsusecaseInstance = new Usecase_1.AdminInvestorDetailsusecase(AdminRepositoryInstance);
const InvestorstatusUsecaseInstance = new Usecase_1.InvestorstatusUsecase(AdminRepositoryInstance);
const AddplanusecaseInstance = new Usecase_1.Addplanusecase();
const GetplanusecaseInstance = new Usecase_1.Getplanusecase(AdminRepositoryInstance);
const AdminEntrepreneurModelsInstance = new Usecase_1.AdminEntrepreneurModels(AdminRepositoryInstance);
const AdminmodeldetailsInstance = new Usecase_1.Adminmodeldetails(AdminRepositoryInstance);
const DahboardUsecaseInstance = new Usecase_1.DahboardUsecase(AdminRepositoryInstance);
const AdminControllerInstance = new AdminController_1.AdminController(AdminLoginUsecaseInstance, GetInvestorUsecaseInstance, GetEntrepreneurUsecaseInstance, EntrepreneurBlockusecaseInstance, CategoryUsecaseInstance, GetCategoryUsecaseInstance, EditcategoryUsecaseInstance, categoryListingUsecaseInstance, AdminInvestorDetailsusecaseInstance, InvestorstatusUsecaseInstance, AddplanusecaseInstance, GetplanusecaseInstance, AdminEntrepreneurModelsInstance, AdminmodeldetailsInstance, DahboardUsecaseInstance);
router.post("/login", (req, res, next) => {
    AdminControllerInstance.adminLogin(req, res, next);
});
router.get("/investorlist", (0, Auth_1.default)(['admin']), (req, res, next) => {
    AdminControllerInstance.getInvestor(req, res, next);
});
router.get("/entrepreneurlist", (0, Auth_1.default)(['admin']), (req, res, next) => {
    AdminControllerInstance.getEntrepreneur(req, res, next);
});
router.post("/entrepreneurblock", (0, Auth_1.default)(['admin']), (req, res, next) => {
    AdminControllerInstance.blockEntrepreneur(req, res, next);
});
router.post("/add-category", upload.single("image"), (req, res, next) => {
    AdminControllerInstance.AddCategory(req, res, next);
});
router.get("/category", (req, res, next) => {
    AdminControllerInstance.GetCategory(req, res, next);
});
router.put("/edit-category", upload.single("image"), (req, res, next) => {
    AdminControllerInstance.EditCategory(req, res, next);
});
router.put("/categorylist", (req, res, next) => {
    AdminControllerInstance.listcategory(req, res, next);
});
router.get("/investor-details", (req, res, next) => {
    AdminControllerInstance.InvestorDetails(req, res, next);
});
router.post("/investor-verify", (req, res, next) => {
    AdminControllerInstance.InvestorVerify(req, res, next);
});
router.post("/add-plan", (req, res, next) => {
    AdminControllerInstance.addPlan(req, res, next);
});
router.get("/premium-plan", (req, res, next) => {
    AdminControllerInstance.getPlans(req, res, next);
});
router.get("/entrepreneurmodels/:id", (req, res, next) => {
    AdminControllerInstance.GetentreprenuerModel(req, res, next);
});
router.get("/model-details/:id", (req, res, next) => {
    AdminControllerInstance.modelDetails(req, res, next);
});
router.get("/user-statistics", (req, res, next) => {
    AdminControllerInstance.getDashboardData(req, res, next);
});
