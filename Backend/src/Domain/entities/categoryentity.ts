import { Types } from "mongoose";
import { CategoryModel } from "../../Infrastructure/Database/Model"; // Adjust path as needed

export interface ICategoryData {
    _id: Types.ObjectId;
    categoryname: string;
    image: string;
    is_Listed: boolean;
}

export class Category implements ICategoryData {
    _id: Types.ObjectId;
    categoryname: string;
    image: string;
    is_Listed: boolean;

    constructor(data: Partial<ICategoryData>) {
        this._id = data._id || new Types.ObjectId();
        this.categoryname = data.categoryname!;
        this.image = data.image!;
        this.is_Listed = data.is_Listed ?? true;
    }

    toCategoryData(): ICategoryData {
        return {
            _id: this._id,
            categoryname: this.categoryname,
            image: this.image,
            is_Listed: this.is_Listed,
        };
    }

    async save(): Promise<Category> {
        const categoryData = this.toCategoryData();
        const category = new CategoryModel(categoryData);
        await category.save();
        return this;
    }
}
