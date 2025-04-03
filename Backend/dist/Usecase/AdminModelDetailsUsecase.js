"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adminmodeldetails = void 0;
class Adminmodeldetails {
    constructor(adminrepo) {
        this.adminrepo = adminrepo;
    }
    async execute(id) {
        try {
            const details = await this.adminrepo.modelDetails(id);
            return details;
        }
        catch (error) {
        }
    }
}
exports.Adminmodeldetails = Adminmodeldetails;
