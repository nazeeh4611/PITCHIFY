"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurBlockusecase = void 0;
class EntrepreneurBlockusecase {
    constructor(AdminRepository) {
        this.AdminRepository = AdminRepository;
    }
    async execute(email) {
        try {
            const entrepreneur = await this.AdminRepository.blockUnblockEntrepreneur(email);
            return entrepreneur;
        }
        catch (error) {
        }
    }
}
exports.EntrepreneurBlockusecase = EntrepreneurBlockusecase;
