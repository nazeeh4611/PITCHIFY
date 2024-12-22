import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"


export class EntrepreneuProfileUsecase { 
    constructor(
        private Entrepreneurrepository : IEntrepreneurRepository
    ){}
    

    async execute(email:string):Promise<any>{

        try {
             console.log("reach")
            const entrepreneur = await this.Entrepreneurrepository.findbyEmail(email)

            if(entrepreneur){
                console.log("entrpere,",entrepreneur)
            }

            return {
                entrepreneur
            }
        } catch (error) {
            console.error("error occured in find data ")
        }
    }
}