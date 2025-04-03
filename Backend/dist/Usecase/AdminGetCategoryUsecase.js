"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoryUsecase = void 0;
class GetCategoryUsecase {
    constructor(adminrepository) {
        this.adminrepository = adminrepository;
    }
    async execute() {
        try {
            return this.adminrepository.getAllCategory();
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.GetCategoryUsecase = GetCategoryUsecase;
