"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetmodelUsecase = void 0;
class GetmodelUsecase {
    constructor(entrpreneurrepo) {
        this.entrpreneurrepo = entrpreneurrepo;
    }
    async execute(email) {
        try {
            const result = await this.entrpreneurrepo.getmodel(email);
            return result;
        }
        catch (error) {
            console.error("Error fetching entrepreneur model:", error);
            throw new Error("Failed to fetch entrepreneur model.");
        }
    }
}
exports.GetmodelUsecase = GetmodelUsecase;
