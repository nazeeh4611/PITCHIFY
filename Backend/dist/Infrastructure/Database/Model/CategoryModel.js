"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    categoryname: { type: String, required: true },
    image: { type: String, required: true },
    is_Listed: { type: Boolean, default: true },
});
exports.default = (0, mongoose_1.model)('Category', CategorySchema);
