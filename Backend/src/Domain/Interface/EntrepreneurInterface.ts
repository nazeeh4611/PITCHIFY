import { IEntrepreneurdata } from "../../Infrastructure/Database/Model/Entrepreneurmodel";
import { Entrepreneur } from "../entities/entrepreneurentities";

export interface IEntrepreneurRepository {
    getbyId(id: string): Promise<IEntrepreneurdata | null>;
    saveentrepreneur(user: Entrepreneur): Promise<IEntrepreneurdata>;
    findbyEmail(email: string): Promise<IEntrepreneurdata | null>;
    update(user:Partial<Entrepreneur>):Promise<IEntrepreneurdata>;
  }


  