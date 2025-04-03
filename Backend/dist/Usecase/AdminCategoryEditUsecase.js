"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditcategoryUsecase = void 0;
class EditcategoryUsecase {
    constructor(adminrepository) {
        this.adminrepository = adminrepository;
    }
    async execute(categoryname, image, _id) {
        if (!categoryname || !image || !_id) {
            throw new Error("Invalid input: categoryname, image, and _id are required.");
        }
        try {
            const updatedCategory = await this.adminrepository.updatecategory({
                categoryname,
                image,
                _id,
            });
            return updatedCategory; // Return the updated category if needed
        }
        catch (error) {
            console.error("Error in EditcategoryUsecase:", error);
            throw error;
        }
    }
}
exports.EditcategoryUsecase = EditcategoryUsecase;
