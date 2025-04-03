"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionPlanSchema = new mongoose_1.Schema({
    planName: { type: String, required: true },
    description: { type: String, required: true },
    planPrice: { type: Number, required: true },
    Duration: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    users: { type: Number, default: 0 }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("SubscriptionPlan", SubscriptionPlanSchema);
