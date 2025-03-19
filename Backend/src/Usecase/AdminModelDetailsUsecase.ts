import {Iadminrepository} from "../Domain/Interface/AdminInterface"


export class Adminmodeldetails{
    constructor(
        private adminrepo:Iadminrepository
    ){}


    async execute(id:string){
        try {
            const details = await this.adminrepo.modelDetails(id)
            return details
        } catch (error) {
            
        }
    }
}