"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorRepository = void 0;
const Index_1 = require("../Database/Model/Index");
const Index_2 = require("../Database/Model/Index");
class InvestorRepository {
    async findbyEmail(email) {
        try {
            return await Index_1.InvestorModel.findOne({ email })
                .populate('premium.plan').populate("savedmodel")
                .exec();
        }
        catch (error) {
            throw new Error(`Error occurred while searching for investor with email: ${email}`);
        }
    }
    async getbyId(id) {
        try {
            return await Index_1.InvestorModel.findOne({ _id: id });
        }
        catch (error) {
            throw new Error(`Error occurred while retrieving investor by ID: ${id}`);
        }
    }
    async saveinvestor(user) {
        try {
            const createInvestor = new Index_1.InvestorModel(user);
            return (await createInvestor.save());
        }
        catch (error) {
            throw new Error("Error occurred while saving investor");
        }
    }
    async update(user) {
        try {
            const updatedInvestor = await Index_1.InvestorModel.findOneAndUpdate({ email: user.email }, { ...user }, { new: true });
            if (!updatedInvestor) {
                throw new Error("Failed to update investor: User not found");
            }
            return updatedInvestor;
        }
        catch (error) {
            throw new Error("Error occurred while updating investor details");
        }
    }
    async verifyinvestor(email, companydetails, status, companyName) {
        try {
            const verifiedinvestor = await Index_1.InvestorModel.findOneAndUpdate({ email: email }, { companydetails: companydetails, status: status, comapanyname: companyName }, { new: true });
            if (!verifiedinvestor) {
                throw new Error(`Failed to verify investor with email: ${email}`);
            }
            return verifiedinvestor;
        }
        catch (error) {
            throw new Error(`Error occurred while verifying investor with email: ${email}`);
        }
    }
    async modelsbycategory(category) {
        try {
            const models = await Index_1.BusinessModel.find({ industryFocus: category }).populate('industryFocus');
            return models;
        }
        catch (error) {
            console.error(`Error in modelsbycategory:`, error);
            return null;
        }
    }
    async modelDetails(id) {
        try {
            const details = await Index_1.BusinessModel.findById(id).populate('uploadedentrepreneur');
            return details;
        }
        catch (error) {
            return null;
        }
    }
    async addpremium(id, startdate, enddate, email) {
        try {
            const result = await Index_1.InvestorModel.findOneAndUpdate({ email: email }, {
                $set: {
                    'premium.plan': id,
                    'premium.startDate': startdate,
                    'premium.endDate': enddate
                }
            }, { new: true });
            await Index_1.PremiumModel.findByIdAndUpdate(id, { $inc: { users: 1 } }, { new: true });
            return result;
        }
        catch (error) {
            console.error("Error updating premium:", error);
            return null;
        }
    }
    async addreview(modelId, rating, review, email) {
        try {
            const investor = await this.findbyEmail(email);
            if (!investor)
                throw new Error("Investor not found");
            const investorId = investor._id;
            const newReview = await Index_2.ReviewModel.create({
                rate: rating,
                review,
                rated_by: investorId,
                modelid: modelId,
            });
            const updatedModel = await Index_1.BusinessModel.findOneAndUpdate({ _id: modelId }, { $push: { reviews: newReview._id } }, { new: true }).lean();
            return updatedModel;
        }
        catch (error) {
            console.error("Error adding review:", error);
            return null;
        }
    }
    async getReciever(id) {
        try {
            const chatData = await Index_1.ChatModel.findOne({ _id: id })
                .populate('entrepreneur')
                .populate('investor');
            return chatData;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async savemodel(email, modelId) {
        try {
            const investordata = await Index_1.InvestorModel.findOneAndUpdate({ email: email }, { $push: { savedmodel: modelId } }, { new: true });
            console.log(investordata, "in repo");
            return investordata;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async unsavemodel(email, modelId) {
        try {
            const investordata = await Index_1.InvestorModel.findOneAndUpdate({ email: email }, { $pull: { savedmodel: modelId } }, { new: true });
            console.log(investordata, "in repo");
            return investordata;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async exclusiveModel() {
        try {
            const modelData = await Index_1.BusinessModel.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();
            return modelData;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
}
exports.InvestorRepository = InvestorRepository;
