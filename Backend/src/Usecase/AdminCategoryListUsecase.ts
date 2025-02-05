import { Types } from "mongoose";
import { Iadminrepository } from "../Domain/Interface/AdminInterface";


export class categoryListingUsecase{
   constructor(
    private adminrepository:Iadminrepository
   ){}


   async execute(id:Types.ObjectId){
    
    try {
        const list = this.adminrepository.unlistcategory(id)
        return list
    } catch (error) {
        
    }
   }
}