"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrepreneurpremiumusecase = void 0;
class entrepreneurpremiumusecase {
    constructor(entrepreneurrepo) {
        this.entrepreneurrepo = entrepreneurrepo;
    }
    async execute(id, startdate, enddate, email) {
        try {
            const entrepreneurDetails = await this.entrepreneurrepo.addpremium(id, startdate, enddate, email);
            return entrepreneurDetails;
        }
        catch (error) {
        }
    }
}
exports.entrepreneurpremiumusecase = entrepreneurpremiumusecase;
