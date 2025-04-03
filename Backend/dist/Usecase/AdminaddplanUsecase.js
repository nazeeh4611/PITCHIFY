"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Addplanusecase = void 0;
const Premiumentity_1 = require("../Domain/entities/Premiumentity");
class Addplanusecase {
    async execute(planName, description, planPrice, Duration) {
        const plan = new Premiumentity_1.Premium({
            planName,
            planPrice,
            Duration,
            description
        });
        await plan.save();
        return plan.toPlanData();
    }
}
exports.Addplanusecase = Addplanusecase;
