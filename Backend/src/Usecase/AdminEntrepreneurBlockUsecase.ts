
import {Iadminrepository} from "../Domain/Interface/AdminInterface"
import { Entrepreneur } from "../Domain/entities/entrepreneurentities"


export class EntrepreneurBlockusecase{
    constructor(
    private AdminRepository:Iadminrepository
    ){}


    async execute(email:string):Promise<any> {
      try {
        
        const entrepreneur =  await this.AdminRepository.blockUnblockEntrepreneur(email)
         return entrepreneur
      } catch (error) {
        
      }
    }
}