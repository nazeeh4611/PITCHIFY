"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviewusecase = void 0;
class Reviewusecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(modelId, rating, review, email) {
        try {
            const data = await this.investorrepo.addreview(modelId, rating, review, email);
        }
        catch (error) {
        }
    }
}
exports.Reviewusecase = Reviewusecase;
