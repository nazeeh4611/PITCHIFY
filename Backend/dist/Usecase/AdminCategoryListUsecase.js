"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryListingUsecase = void 0;
class categoryListingUsecase {
    constructor(adminrepository) {
        this.adminrepository = adminrepository;
    }
    async execute(id) {
        try {
            const list = this.adminrepository.unlistcategory(id);
            return list;
        }
        catch (error) {
        }
    }
}
exports.categoryListingUsecase = categoryListingUsecase;
