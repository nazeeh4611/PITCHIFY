"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrepreneurRepository = void 0;
const Entrepreneurmodel_1 = __importDefault(require("../Database/Model/Entrepreneurmodel"));
const ModelsModel_1 = __importDefault(require("../Database/Model/ModelsModel"));
const Index_1 = require("../Database/Model/Index");
class entrepreneurRepository {
    async findbyEmail(email) {
        return Entrepreneurmodel_1.default.findOne({ email }).populate('premium.plan')
            .exec();
    }
    async getbyId(id) {
        try {
            return Entrepreneurmodel_1.default.findById(id);
        }
        catch (error) {
            console.error("Error in getbyId:", error);
            throw new Error("Error while fetching entrepreneur by ID.");
        }
    }
    async saveentrepreneur(user) {
        try {
            const createEntrepreneur = new Entrepreneurmodel_1.default(user);
            return createEntrepreneur.save();
        }
        catch (error) {
            console.error("Error in saveentrepreneur:", error);
            throw new Error("Error while saving entrepreneur.");
        }
    }
    async update(user) {
        try {
            console.log(user, "this be the user in update repo");
            const updatedEntrepreneur = await Entrepreneurmodel_1.default.findOneAndUpdate({ email: user.email, }, { ...user }, { new: true });
            if (!updatedEntrepreneur) {
                throw new Error("Entrepreneur not found.");
            }
            return updatedEntrepreneur;
        }
        catch (error) {
            console.error("Error in update:", error);
            throw new Error("Error while updating entrepreneur.");
        }
    }
    async savemodel(email, model) {
        try {
            const updatedEntrepreneur = await Entrepreneurmodel_1.default.findOneAndUpdate({ email }, { $push: { businessModels: model } }, { new: true });
            if (!updatedEntrepreneur) {
                throw new Error("Entrepreneur not found.");
            }
            return updatedEntrepreneur;
        }
        catch (error) {
            console.error("Error in savemodel:", error);
            throw new Error("Error while saving model.");
        }
    }
    async getmodel(email) {
        try {
            const populatedModel = await Entrepreneurmodel_1.default.findOne({ email })
                .populate({
                path: "businessModels",
                populate: [
                    {
                        path: "reviews",
                        model: "Review",
                        populate: {
                            path: "rated_by",
                            model: "Investor",
                        },
                    },
                ],
            })
                .exec();
            return populatedModel;
        }
        catch (error) {
            console.error("Error in getmodel:", error);
            throw new Error("Error while fetching models.");
        }
    }
    async modeldetails(id) {
        try {
            const businessModel = await ModelsModel_1.default.findById(id)
                .populate("industryFocus")
                .exec();
            return businessModel;
        }
        catch (error) {
            console.error("Error in modeldetails:", error);
            throw new Error("Error while fetching model details.");
        }
    }
    async editmodel(model, id) {
        try {
            const updatedModel = await ModelsModel_1.default.findByIdAndUpdate(id, { ...model }, { new: true });
            if (!updatedModel) {
                throw new Error("Model not found.");
            }
            return updatedModel;
        }
        catch (error) {
            console.error("Error in editmodel:", error);
            throw new Error("Error while editing model.");
        }
    }
    async addpremium(id, startdate, enddate, email) {
        try {
            const result = await Entrepreneurmodel_1.default.findOneAndUpdate({ email: email }, {
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
}
exports.entrepreneurRepository = entrepreneurRepository;
