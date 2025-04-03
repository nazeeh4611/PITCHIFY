"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const Investormodel_1 = __importDefault(require("../Database/Model/Investormodel"));
const Index_1 = require("../Database/Model/Index");
const Entrepreneurmodel_1 = __importDefault(require("../Database/Model/Entrepreneurmodel"));
const Index_2 = require("../Database/Model/Index");
const Index_3 = require("../Database/Model/Index");
class AdminRepository {
    constructor() { }
    async findEmail(email) {
        return await Entrepreneurmodel_1.default.findOne({ email }).lean() || null;
    }
    async getAllEntrepreneur() {
        try {
            const entrepreneurs = await Entrepreneurmodel_1.default.find().lean();
            return entrepreneurs.length > 0 ? entrepreneurs : null;
        }
        catch (error) {
            throw new Error("Error occurred in getAllEntrepreneur: ");
        }
    }
    async getAllInvestor() {
        try {
            const investors = await Investormodel_1.default.find().lean();
            return investors.length > 0 ? investors : null;
        }
        catch (error) {
            throw new Error("Error occurred in getAllInvestor: ");
        }
    }
    async investorDetails(id) {
        try {
            const investorDetails = await Investormodel_1.default.findById(id);
            return investorDetails;
        }
        catch (error) {
            console.error("Error fetching investor details:", error);
            return null;
        }
    }
    async investorupdatestatus(status, email) {
        try {
            const investorData = await Investormodel_1.default.findOneAndUpdate({ email: email }, { status: status }, { new: true });
            return investorData;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async blockUnblockEntrepreneur(email) {
        try {
            const entrepreneur = await Entrepreneurmodel_1.default.findOne({ email });
            if (entrepreneur) {
                entrepreneur.is_Blocked = !entrepreneur.is_Blocked;
                await entrepreneur.save();
                return entrepreneur;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error blocking/unblocking entrepreneur:', error);
            return null;
        }
    }
    async findCategory(name) {
        try {
            const category = await Index_2.CategoryModel.findOne({ categoryname: name }).lean();
            return category || null;
        }
        catch (error) {
            console.error("Error occurred in findCategory:", error);
            return null;
        }
    }
    async getAllCategory() {
        try {
            const categories = await Index_2.CategoryModel.find().lean();
            return categories.length > 0 ? categories : null;
        }
        catch (error) {
            throw new Error("Error occurred in get categories: " + error);
        }
    }
    async updatecategory(category) {
        if (!category._id || !category.categoryname || !category.image) {
            throw new Error("Missing required fields: id, name, or image");
        }
        try {
            const updatedCategory = await Index_2.CategoryModel.findByIdAndUpdate(category._id, { categoryname: category.categoryname, image: category.image }, { new: true }).lean();
            return updatedCategory || null;
        }
        catch (error) {
            console.error("Error occurred in updatecategory:", error);
            throw error;
        }
    }
    async unlistcategory(id) {
        if (!id) {
            console.error("Error occurred: No ID provided.");
            return null;
        }
        try {
            const updatecategory = await Index_2.CategoryModel.findById(id);
            if (updatecategory) {
                updatecategory.is_Listed = !updatecategory.is_Listed;
                await updatecategory.save();
                return updatecategory;
            }
            return null;
        }
        catch (error) {
            console.error("Error occurred in unlistcategory:", error);
            return null;
        }
    }
    async getAllpremium() {
        try {
            const plans = await Index_1.PremiumModel.find().lean();
            return plans.length > 0 ? plans : null;
        }
        catch (error) {
            console.error("Error occurred in getAllpremium:", error);
            return null;
        }
    }
    async entrepreneurModels(id) {
        try {
            const models = await Index_3.BusinessModel.find({ uploadedentrepreneur: id }).lean();
            console.log(models, "in repository");
            return models;
        }
        catch (error) {
            console.error("Error fetching entrepreneur models:", error);
            return [];
        }
    }
    async modelDetails(id) {
        try {
            const details = await Index_3.BusinessModel.findById(id);
            return details;
        }
        catch (error) {
            return null;
        }
    }
    async DashboardDetails() {
        try {
            const entrepreneurCount = await Entrepreneurmodel_1.default.countDocuments();
            const investorCount = await Investormodel_1.default.countDocuments();
            const entrepreneurPremium = await Entrepreneurmodel_1.default.countDocuments({
                "premium.plan": { $exists: true, $ne: null }
            });
            const investorPremium = await Investormodel_1.default.countDocuments({
                "premium.plan": { $exists: true, $ne: null }
            });
            const entrepreneurNonPremium = entrepreneurCount - entrepreneurPremium;
            const investorNonPremium = investorCount - investorPremium;
            return {
                entrepreneurCount,
                investorCount,
                entrepreneurPremium,
                investorPremium,
                entrepreneurNonPremium,
                investorNonPremium
            };
        }
        catch (error) {
            console.error("Error in DashboardDetails:", error);
            throw new Error("Failed to fetch dashboard details");
        }
    }
}
exports.AdminRepository = AdminRepository;
