"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryUsecase = void 0;
const categoryentity_1 = require("../Domain/entities/categoryentity");
class CategoryUsecase {
    constructor(adminrepository) {
        this.adminrepository = adminrepository;
    }
    async execute(categoryname, image) {
        try {
            if (!categoryname || !image) {
                return { success: false, message: "Invalid inputs" };
            }
            const existingCategory = await this.adminrepository.findCategory(categoryname);
            if (existingCategory) {
                return { success: false, message: "Category already exists" };
            }
            const category = new categoryentity_1.Category({
                categoryname,
                image,
            });
            await category.save();
            return { success: true, data: category.toCategoryData() };
        }
        catch (error) {
            console.error("Error in CategoryUsecase:", error);
            throw error;
        }
    }
}
exports.CategoryUsecase = CategoryUsecase;
