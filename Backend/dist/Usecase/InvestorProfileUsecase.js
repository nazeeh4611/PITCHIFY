"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorProfileUsecas = void 0;
class InvestorProfileUsecas {
    constructor(Investorrepository) {
        this.Investorrepository = Investorrepository;
    }
    async execute(email) {
        try {
            const Investor = await this.Investorrepository.findbyEmail(email);
            return {
                Investor
            };
        }
        catch (error) {
            console.error("error occured in find data ");
        }
    }
}
exports.InvestorProfileUsecas = InvestorProfileUsecas;
