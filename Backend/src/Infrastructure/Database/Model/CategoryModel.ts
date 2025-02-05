import { Types,Document,Schema,model } from "mongoose";

export interface ICategoryData extends Document {
    _id:Types.ObjectId;
    categoryname:string;
    image:string;
    is_Listed:boolean
}

const CategorySchema = new Schema<ICategoryData>({
    categoryname: { type: String, required: true },
    image: { type: String, required: true },
    is_Listed: { type: Boolean, default: true },
});

export default model<ICategoryData>('Category', CategorySchema);
