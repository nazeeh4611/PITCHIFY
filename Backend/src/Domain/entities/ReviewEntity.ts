import { Types } from "mongoose";
import { ReviewModel } from "../../Infrastructure/Database/Model/Index";

export interface IReview {
    _id?: Types.ObjectId;
    rate: number;
    review: string;
    rated_by: Types.ObjectId;
    modelid: Types.ObjectId;
}

export class Review {
    _id: Types.ObjectId;
    rate: number;
    review: string;
    rated_by: Types.ObjectId;
    modelid: Types.ObjectId;

    constructor(data: Partial<IReview>) {
        if (!data.rated_by || !data.modelid) {
            throw new Error("rated_by and modelid are required fields.");
        }
        this._id = data._id || new Types.ObjectId();
        this.rate = data.rate ?? 0;
        this.review = data.review ?? "";
        this.rated_by = data.rated_by;
        this.modelid = data.modelid;
    }

    toReviewData(): Omit<IReview, "_id"> {
        return {
            rate: this.rate,
            review: this.review,
            rated_by: this.rated_by,
            modelid: this.modelid,
        };
    }

    async save(): Promise<Review> {
        try {
            const reviewData = this.toReviewData();
            const review = new ReviewModel(reviewData);
            console.log("Saving review to DB...");
            await review.save();
            console.log("Review saved:", this);
            return this;
        } catch (err) {
            console.error("Error saving review:", err);
            throw new Error("Failed to save review.");
        }
    }
}
