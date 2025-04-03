"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminInvestorDetailsusecase = void 0;
class AdminInvestorDetailsusecase {
    constructor(adminrepo) {
        this.adminrepo = adminrepo;
    }
    async execute(id) {
        try {
            const investordetails = await this.adminrepo.investorDetails(id);
            return investordetails;
        }
        catch (error) {
        }
    }
}
exports.AdminInvestorDetailsusecase = AdminInvestorDetailsusecase;
