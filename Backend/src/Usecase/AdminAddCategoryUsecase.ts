import { Types } from "mongoose";
import { Category } from "../Domain/entities/categoryentity";
import {Iadminrepository} from  "../Domain/Interface/AdminInterface"


export class CategoryUsecase {
    constructor(private adminrepository: Iadminrepository) {}

    async execute(categoryname: string, image: string) {
        try {
            if (!categoryname || !image) {
                return { success: false, message: "Invalid inputs" };
            }

            const existingCategory = await this.adminrepository.findCategory(categoryname);
            if (existingCategory) {
                return { success: false, message: "Category already exists" };
            }

            const category = new Category({
                categoryname,
                image,
            });

            await category.save();
            return { success: true, data: category.toCategoryData() };

        } catch (error) {
            console.error("Error in CategoryUsecase:", error);
            throw error;
        }
    }
}
