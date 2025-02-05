import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"
import { IEntrepreneurdata } from "../Domain/entities/entrepreneurentities";

export class EntreprenuerEditProfileUsecase {
    constructor(private EntrepreneurRepo: IEntrepreneurRepository) {}

    async execute(email: string, firstname: string,lastname:string, phone: number,profile:string): Promise<IEntrepreneurdata | null> {
        try {
            const updatedEntrepreneur = await this.EntrepreneurRepo.update({ email, firstname,lastname, phone, profile });
            if (!updatedEntrepreneur) {
                throw new Error("Entrepreneur not found or update failed");
            }
            return updatedEntrepreneur;
        } catch (error) {
            console.error("Error in execute method:", error);
            throw error;
        }
    }
    
    
}
