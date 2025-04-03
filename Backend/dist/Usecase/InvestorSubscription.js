"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investorsubscritptionusecase = void 0;
class Investorsubscritptionusecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(id, startdate, enddate, email) {
        try {
            const investordata = await this.investorrepo.addpremium(id, startdate, enddate, email);
            return investordata;
        }
        catch (error) {
        }
    }
}
exports.Investorsubscritptionusecase = Investorsubscritptionusecase;
