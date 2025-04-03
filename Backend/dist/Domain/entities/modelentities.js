"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const mongoose_1 = require("mongoose");
class Model {
    constructor(data) {
        if (!data._id) {
            throw new Error("id is missing in modeldata");
        }
        this._id = new mongoose_1.Types.ObjectId();
        this.businessName = data.businessName;
        this.tagline = data.tagline;
        this.fundinggoal = data.tagline;
        this.industryFocus = data.industryFocus;
        this.problemStatement = data.problemStatement;
        this.solution = data.solution;
        this.teamexpertise = data.teamexpertise;
        this.postedDate = data.postedDate;
        this.pitchvideo = data.pitchvideo;
        this.useOfFunds = data.useOfFunds;
        this.location = data.location;
        this.marketOpportunities = data.marketOpportunities;
        this.targetAudience = data.targetAudience;
        this.model = data.model;
        this.uploadedentrepreneur = data.uploadedentrepreneur;
        this.reviews = data.reviews;
    }
    toModelData() {
        return {
            _id: this._id,
            businessName: this.businessName,
            tagline: this.tagline,
            fundinggoal: this.fundinggoal,
            industryFocus: this.industryFocus,
            targetAudience: this.targetAudience,
            problemStatement: this.problemStatement,
            solution: this.solution,
            teamexpertise: this.teamexpertise,
            postedDate: this.postedDate,
            pitchvideo: this.pitchvideo,
            useOfFunds: this.useOfFunds,
            location: this.location,
            marketOpportunities: this.marketOpportunities,
            model: this.model,
            uploadedentrepreneur: this.uploadedentrepreneur,
            reviews: this.reviews
        };
    }
    async save() {
        console.log("model saved to the database", this);
        return this;
    }
}
exports.Model = Model;
