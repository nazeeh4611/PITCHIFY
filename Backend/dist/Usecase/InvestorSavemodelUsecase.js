"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savemodelUsecase = void 0;
class savemodelUsecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(email, modelId) {
        const updatedInvestor = await this.investorrepo.savemodel(email, modelId);
        console.log(updatedInvestor, "may in usecase ");
        return updatedInvestor;
    }
}
exports.savemodelUsecase = savemodelUsecase;
