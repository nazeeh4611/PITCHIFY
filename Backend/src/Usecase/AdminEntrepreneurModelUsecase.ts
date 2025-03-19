import {Iadminrepository} from "../Domain/Interface/AdminInterface"



export class AdminEntrepreneurModels{
    constructor(
        private adminrepository : Iadminrepository
    ){}

    async execute(id:string){
        try {
            const models = await this.adminrepository.entrepreneurModels(id)
            return models
        } catch (error) {
            console.error(error)
        }
    }
}