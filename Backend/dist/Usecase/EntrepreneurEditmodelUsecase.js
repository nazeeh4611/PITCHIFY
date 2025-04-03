"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editmodelusecase = void 0;
class Editmodelusecase {
    constructor(entrepreneurrepo) {
        this.entrepreneurrepo = entrepreneurrepo;
    }
    async execute(id, { businessName, tagline, fundinggoal, industryFocus, problemStatement, solution, targetAudience, marketOpportunities, useOfFunds, location, teamexpertise, pitchvideo, }) {
        try {
            const updatedModel = await this.entrepreneurrepo.editmodel({
                businessName,
                tagline,
                fundinggoal,
                industryFocus,
                problemStatement,
                solution,
                targetAudience,
                marketOpportunities,
                useOfFunds,
                location,
                teamexpertise,
                pitchvideo,
            }, id);
            if (!updatedModel) {
                throw new Error("Failed to update model.");
            }
            return updatedModel;
        }
        catch (error) {
            console.error("Error in Editmodelusecase execute:", error);
            throw new Error("Error while executing the Editmodelusecase.");
        }
    }
}
exports.Editmodelusecase = Editmodelusecase;
