"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(loginusecase, getInvestorusecase, getEntrepreneurusecase, entreprenuerblockusecase, addcategoryusecase, getcategoryusecase, editcategoryusecase, categorylistusecase, investordetailsusecase, statususecase, addplanusecase, getplanusecase, entrepreneurmodelusecase, adminmodeldetailsusecase, dashboardusecase) {
        this.loginusecase = loginusecase;
        this.getInvestorusecase = getInvestorusecase;
        this.getEntrepreneurusecase = getEntrepreneurusecase;
        this.entreprenuerblockusecase = entreprenuerblockusecase;
        this.addcategoryusecase = addcategoryusecase;
        this.getcategoryusecase = getcategoryusecase;
        this.editcategoryusecase = editcategoryusecase;
        this.categorylistusecase = categorylistusecase;
        this.investordetailsusecase = investordetailsusecase;
        this.statususecase = statususecase;
        this.addplanusecase = addplanusecase;
        this.getplanusecase = getplanusecase;
        this.entrepreneurmodelusecase = entrepreneurmodelusecase;
        this.adminmodeldetailsusecase = adminmodeldetailsusecase;
        this.dashboardusecase = dashboardusecase;
    }
    async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ success: false, message: "email and password required" });
                return;
            }
            const response = await this.loginusecase.execute(email, password);
            console.log(response);
            const token = response.token;
            res.status(200).json({ success: true, token });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "internal server error" });
        }
    }
    async getInvestor(req, res, next) {
        try {
            const InvestorData = await this.getInvestorusecase.execute();
            if (InvestorData) {
                res.status(200).json(InvestorData);
            }
            else {
                res.status(404).json({ suceess: false, message: "investor data not found" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "internal server error" });
        }
    }
    async InvestorDetails(req, res, next) {
        try {
            const id = req.query.id;
            if (typeof id === 'string') {
                const response = await this.investordetailsusecase.execute(id);
                res.status(200).json(response);
            }
            else {
                res.status(400).json({ message: 'Invalid ID' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async InvestorVerify(req, res, next) {
        try {
            const { status, email } = req.body;
            const response = await this.statususecase.execute(status, email);
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
    async getEntrepreneur(req, res, next) {
        try {
            const EntrepreneurData = await this.getEntrepreneurusecase.execute();
            if (EntrepreneurData) {
                res.status(200).json(EntrepreneurData);
            }
            else {
                res.status(404).json({ success: false, message: "Entrepreneur data not found" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async blockEntrepreneur(req, res, next) {
        try {
            const email = req.body.email;
            const response = await this.entreprenuerblockusecase.execute(email);
            if (response) {
                res.status(200).json({ success: true, message: "user blocked" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async AddCategory(req, res, next) {
        try {
            const categoryname = req.body.name;
            const file = req.file.location;
            if (!categoryname || !file) {
                res.status(400).json({ success: false, message: "Category name and file are required" });
                return;
            }
            const response = await this.addcategoryusecase.execute(categoryname, file);
            if (response.success) {
                res.status(200).json({ success: true, message: "Category added", data: response.data });
            }
            else {
                res.status(400).json({ success: false, message: response.message });
            }
        }
        catch (error) {
            console.error("Error in AddCategory:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async GetCategory(req, res, next) {
        try {
            const response = await this.getcategoryusecase.execute();
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
        }
    }
    async EditCategory(req, res, next) {
        try {
            const { id, name } = req.body;
            const image = req.file.location;
            const response = await this.editcategoryusecase.execute(name, image, id);
            res.status(200).json(response);
        }
        catch (error) {
            console.error("Error in EditCategory:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async listcategory(req, res, next) {
        try {
            const id = req.body.categoryId;
            const response = await this.categorylistusecase.execute(id);
            res.status(200).json({ success: true });
        }
        catch (error) {
        }
    }
    async addPlan(req, res, next) {
        try {
            const { description } = req.body;
            const name = req.body.planName;
            const price = req.body.planPrice;
            const duration = req.body.Duration;
            if (!name || !duration || !price || !description) {
                res.status(400).json({ success: false, message: "All fields are required" });
                return;
            }
            const response = await this.addplanusecase.execute(name, description, price, duration);
            res.status(200).json({
                success: true,
                message: "Plan added successfully",
                data: response
            });
        }
        catch (error) {
            console.error("Error in addPlan:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async getPlans(req, res, next) {
        try {
            const response = await this.getplanusecase.execute();
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
    async GetentreprenuerModel(req, res, next) {
        try {
            const id = req.params.id;
            const response = await this.entrepreneurmodelusecase.execute(id);
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async modelDetails(req, res, next) {
        try {
            const id = req.params.id;
            console.log(id);
            const response = await this.adminmodeldetailsusecase.execute(id);
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getDashboardData(req, res, next) {
        try {
            console.log("call is comming");
            const response = await this.dashboardusecase.execute();
            console.log(response, "may in controller");
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
}
exports.AdminController = AdminController;
