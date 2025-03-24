import {Iadminrepository} from "../Domain/Interface/AdminInterface"

export class DahboardUsecase{
   constructor(
    private adminrepo:Iadminrepository
   ){}

   async execute(){
    const details = await this.adminrepo.DashboardDetails()
    console.log(details,"may in usecase")
    return details
   }
}