"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investormodeldetails = void 0;
class Investormodeldetails {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(id) {
        try {
            const details = await this.investorrepo.modelDetails(id);
            return details;
        }
        catch (error) {
        }
    }
}
exports.Investormodeldetails = Investormodeldetails;
