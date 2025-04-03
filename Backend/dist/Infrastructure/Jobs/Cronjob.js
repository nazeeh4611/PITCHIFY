"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const Index_1 = require("../Database/Model/Index");
node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        const now = new Date();
        const result = await Index_1.EntrepreneurModel.updateMany({ "premium.endDate": { $lt: now } }, { $unset: { premium: "" } });
        console.log(`Removed premium plans from ${result.modifiedCount} entrepreneurs`);
    }
    catch (error) {
        console.error("Error in entrepreneur cron job:", error);
    }
});
node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        const now = new Date();
        const result = await Index_1.InvestorModel.updateMany({ "premium.endDate": { $lt: now } }, { $unset: { premium: "" } });
        console.log(`Removed premium plans from ${result.modifiedCount} investors`);
    }
    catch (error) {
        console.error("Error in investor cron job:", error);
    }
});
