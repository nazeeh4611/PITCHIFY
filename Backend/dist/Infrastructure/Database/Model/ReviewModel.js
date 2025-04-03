"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    rate: { type: Number, required: true },
    review: { type: String, required: true },
    rated_by: { type: mongoose_1.Schema.Types.ObjectId, required: true, red: "Investor" },
    modelid: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Review", ReviewSchema);
