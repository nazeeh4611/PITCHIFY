"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investordetailsusecase = void 0;
class investordetailsusecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute(email) {
        try {
            const details = await this.investorrepo.findbyEmail(email);
            return details;
        }
        catch (error) {
        }
    }
}
exports.investordetailsusecase = investordetailsusecase;
