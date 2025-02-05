import {Iadminrepository} from "../Domain/Interface/AdminInterface"


export class Getplanusecase{
    constructor(
        private adminrepo:Iadminrepository
    ){}


    async execute():Promise<any>{
    try {
        return this.adminrepo.getAllpremium()
    } catch (error) {
        
    }
    }
}