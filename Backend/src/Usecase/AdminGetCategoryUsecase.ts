import { Iadminrepository } from "../Domain/Interface/AdminInterface";


export class GetCategoryUsecase {
    constructor(
        private adminrepository:Iadminrepository
    ){}

    async execute():Promise<any>{
        try {
            return this.adminrepository.getAllCategory()
        } catch (error) {
            console.error(error)
        }
    }
}