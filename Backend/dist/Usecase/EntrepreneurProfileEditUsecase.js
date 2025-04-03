"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntreprenuerEditProfileUsecase = void 0;
class EntreprenuerEditProfileUsecase {
    constructor(EntrepreneurRepo) {
        this.EntrepreneurRepo = EntrepreneurRepo;
    }
    async execute(email, firstname, lastname, phone, profile) {
        try {
            const updatedEntrepreneur = await this.EntrepreneurRepo.update({ email, firstname, lastname, phone, profile });
            if (!updatedEntrepreneur) {
                throw new Error("Entrepreneur not found or update failed");
            }
            return updatedEntrepreneur;
        }
        catch (error) {
            console.error("Error in execute method:", error);
            throw error;
        }
    }
}
exports.EntreprenuerEditProfileUsecase = EntreprenuerEditProfileUsecase;
