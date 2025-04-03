"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investorModelsUsecase = void 0;
class investorModelsUsecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(category) {
        try {
            const models = await this.investorrepo.modelsbycategory(category);
            return models;
        }
        catch (error) {
        }
    }
}
exports.investorModelsUsecase = investorModelsUsecase;
