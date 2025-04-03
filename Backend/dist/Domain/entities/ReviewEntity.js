"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const Index_1 = require("../../Infrastructure/Database/Model/Index");
class Review {
    constructor(data) {
        if (!data.rated_by || !data.modelid) {
            throw new Error("rated_by and modelid are required fields.");
        }
        this._id = data._id || new mongoose_1.Types.ObjectId();
        this.rate = data.rate ?? 0;
        this.review = data.review ?? "";
        this.rated_by = data.rated_by;
        this.modelid = data.modelid;
    }
    toReviewData() {
        return {
            rate: this.rate,
            review: this.review,
            rated_by: this.rated_by,
            modelid: this.modelid,
        };
    }
    async save() {
        try {
            const reviewData = this.toReviewData();
            const review = new Index_1.ReviewModel(reviewData);
            console.log("Saving review to DB...");
            await review.save();
            console.log("Review saved:", this);
            return this;
        }
        catch (err) {
            console.error("Error saving review:", err);
            throw new Error("Failed to save review.");
        }
    }
}
exports.Review = Review;
