"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddmodelUsecase = void 0;
const mongoose_1 = require("mongoose");
const Index_1 = require("../Infrastructure/Database/Model/Index");
class AddmodelUsecase {
    constructor(entrepreneurrepo) {
        this.entrepreneurrepo = entrepreneurrepo;
    }
    async execute(businessName, tagline, industryFocus, targetAudience, problemStatement, solution, teamExpertise, useOfFunds, location, marketOpportunities, fundingGoal, email, pitchvideo) {
        const entrepreneur = await this.entrepreneurrepo.findbyEmail(email);
        const businessModel = new Index_1.BusinessModel({
            _id: new mongoose_1.Types.ObjectId(),
            businessName,
            tagline,
            industryFocus,
            targetAudience,
            problemStatement,
            solution,
            teamexpertise: teamExpertise,
            useOfFunds,
            location,
            marketOpportunities,
            fundinggoal: fundingGoal,
            pitchvideo,
            uploadedentrepreneur: entrepreneur?._id
        });
        const id = businessModel._id;
        const updateentrepreneur = await this.entrepreneurrepo.savemodel(email, id);
        await businessModel.save();
        return updateentrepreneur;
    }
}
exports.AddmodelUsecase = AddmodelUsecase;
