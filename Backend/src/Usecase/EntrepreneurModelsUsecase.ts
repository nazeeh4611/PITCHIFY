import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"



export class GetmodelUsecase{
    constructor(
     private entrpreneurrepo:IEntrepreneurRepository
    ){}

    async execute(email: string) {
        try {
            const result = await this.entrpreneurrepo.getmodel(email);
            return result;
        } catch (error) {
            console.error("Error fetching entrepreneur model:", error);
            throw new Error("Failed to fetch entrepreneur model.");
        }
    }
    
}