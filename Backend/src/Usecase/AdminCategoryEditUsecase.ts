import { Types } from "mongoose";
import { Iadminrepository } from "../Domain/Interface/AdminInterface";

export class EditcategoryUsecase {
    constructor(private adminrepository: Iadminrepository) {}

    async execute(categoryname: string, image: string, _id: Types.ObjectId) {
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
        } catch (error) {
            console.error("Error in EditcategoryUsecase:", error);
            throw error;
        }
    }
}
