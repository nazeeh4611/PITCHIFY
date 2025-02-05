import { Iadminrepository } from "../Domain/Interface/AdminInterface";


export class GetEntrpreneurUsecase{
    constructor(
        private getEntreprenueRepo:Iadminrepository
    ){}

    async execute():Promise<any>{
        try {
            return await this.getEntreprenueRepo.getAllEntrepreneur()
        } catch (error) {
            console.error(error)
        }
    }
}