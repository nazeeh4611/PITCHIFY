"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsavemodelUsecase = void 0;
class UnsavemodelUsecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(email, modelId) {
        try {
            const updatedInvestor = await this.investorrepo.unsavemodel(email, modelId);
            return updatedInvestor;
        }
        catch (error) {
        }
    }
}
exports.UnsavemodelUsecase = UnsavemodelUsecase;
