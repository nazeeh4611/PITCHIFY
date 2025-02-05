import {IEntrepreneurRepository} from  "../Domain/Interface/EntrepreneurInterface"

export class entrepreneurpremiumusecase{
    constructor(
        private entrepreneurrepo:IEntrepreneurRepository
    ){}

    async execute(id:string,startdate:Date,enddate:Date,email:string){
        try {
            const entrepreneurDetails = await this.entrepreneurrepo.addpremium(id,startdate,enddate,email)
            return entrepreneurDetails
        } catch (error) {
            
        }
    }
}