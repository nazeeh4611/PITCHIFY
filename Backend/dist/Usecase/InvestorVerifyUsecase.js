"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investorverifyusecase = void 0;
class Investorverifyusecase {
    constructor(investorrepository) {
        this.investorrepository = investorrepository;
    }
    async execute(email, companydetails, status, companyName) {
        try {
            const verifyinvestor = await this.investorrepository.verifyinvestor(email, companydetails, status, companyName);
            if (!verifyinvestor) {
                throw new Error("Failed to find investor with the provided email");
            }
            return verifyinvestor;
        }
        catch (error) {
            console.error("Error in investor verification:", error);
            throw new Error("Error occurred during investor verification");
        }
    }
}
exports.Investorverifyusecase = Investorverifyusecase;
