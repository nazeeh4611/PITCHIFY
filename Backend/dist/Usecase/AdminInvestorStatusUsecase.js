"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorstatusUsecase = void 0;
class InvestorstatusUsecase {
    constructor(adminrepo) {
        this.adminrepo = adminrepo;
    }
    async execute(status, email) {
        try {
            const updatedData = await this.adminrepo.investorupdatestatus(status, email);
            return updatedData;
        }
        catch (error) {
        }
    }
}
exports.InvestorstatusUsecase = InvestorstatusUsecase;
