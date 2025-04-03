"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelSchema = new mongoose_1.Schema({
    businessName: { type: String, required: true },
    tagline: { type: String, required: true },
    fundinggoal: { type: String, required: true },
    industryFocus: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
    problemStatement: { type: String, required: true },
    solution: { type: String, required: true },
    targetAudience: { type: String, required: true },
    marketOpportunities: { type: String, required: true },
    useOfFunds: { type: String },
    location: { type: String },
    teamexpertise: { type: String },
    postedDate: { type: Date, default: Date.now },
    pitchvideo: { type: String, required: true, },
    uploadedentrepreneur: { type: mongoose_1.Schema.Types.ObjectId, ref: "Entrepreneur" },
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' }]
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("BusinessModel", ModelSchema);
