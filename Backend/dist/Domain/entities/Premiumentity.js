"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Premium = void 0;
const mongoose_1 = require("mongoose");
const Index_1 = require("../../Infrastructure/Database/Model/Index");
class Premium {
    constructor(data) {
        this._id = data._id || new mongoose_1.Types.ObjectId();
        this.planName = data.planName;
        this.planPrice = data.planPrice;
        this.Duration = data.Duration;
        this.description = data.description;
        this.users = data.users;
    }
    toPlanData() {
        return {
            _id: this._id,
            planName: this.planName,
            planPrice: this.planPrice,
            Duration: this.Duration,
            description: this.description,
            users: this.users
        };
    }
    async save() {
        const PremiumData = this.toPlanData();
        const Premium = new Index_1.PremiumModel(PremiumData);
        console.log("data saved to db");
        await Premium.save();
        console.log(this);
        return this;
    }
}
exports.Premium = Premium;
