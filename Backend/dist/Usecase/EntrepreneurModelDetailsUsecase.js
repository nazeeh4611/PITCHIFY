"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeldetailsUsecase = void 0;
class ModeldetailsUsecase {
    constructor(entrpreneurrepo) {
        this.entrpreneurrepo = entrpreneurrepo;
    }
    async execute(id) {
        try {
            const result = await this.entrpreneurrepo.modeldetails(id);
            return result;
        }
        catch (error) {
            console.error("Error fetching entrepreneur model:", error);
            throw new Error("Failed to fetch entrepreneur model.");
        }
    }
}
exports.ModeldetailsUsecase = ModeldetailsUsecase;
