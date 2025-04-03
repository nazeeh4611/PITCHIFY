"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEntrepreneurModels = void 0;
class AdminEntrepreneurModels {
    constructor(adminrepository) {
        this.adminrepository = adminrepository;
    }
    async execute(id) {
        try {
            const models = await this.adminrepository.entrepreneurModels(id);
            return models;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.AdminEntrepreneurModels = AdminEntrepreneurModels;
