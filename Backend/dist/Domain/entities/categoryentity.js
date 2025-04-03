"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const Index_1 = require("../../Infrastructure/Database/Model/Index");
class Category {
    constructor(data) {
        this._id = data._id || new mongoose_1.Types.ObjectId();
        this.categoryname = data.categoryname;
        this.image = data.image;
        this.is_Listed = data.is_Listed ?? true;
    }
    toCategoryData() {
        return {
            _id: this._id,
            categoryname: this.categoryname,
            image: this.image,
            is_Listed: this.is_Listed,
        };
    }
    async save() {
        const categoryData = this.toCategoryData();
        const category = new Index_1.CategoryModel(categoryData);
        await category.save();
        return this;
    }
}
exports.Category = Category;
