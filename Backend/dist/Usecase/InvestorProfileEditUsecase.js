"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorProfileEditUsecase = void 0;
class InvestorProfileEditUsecase {
    constructor(InvestorRepository) {
        this.InvestorRepository = InvestorRepository;
    }
    async execute(email, firstname, lastname, phone, profile) {
        try {
            const updatedInvestor = await this.InvestorRepository.update({ email, firstname, lastname, phone, profile });
            if (!updatedInvestor) {
                throw new Error("failed to find investor");
            }
            return updatedInvestor;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.InvestorProfileEditUsecase = InvestorProfileEditUsecase;
