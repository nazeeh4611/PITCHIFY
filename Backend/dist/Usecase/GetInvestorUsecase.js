"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInvestorUsecase = void 0;
class GetInvestorUsecase {
    constructor(getinvestorrRepo) {
        this.getinvestorrRepo = getinvestorrRepo;
    }
    async execute() {
        try {
            return this.getinvestorrRepo.getAllInvestor();
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.GetInvestorUsecase = GetInvestorUsecase;
