import {IEntrepreneurdata} from '../Database/Model/Entrepreneurmodel'
import { Types } from 'mongoose'
import Entrepreneurmodel from '../Database/Model/Entrepreneurmodel'
import {IEntrepreneurRepository} from '../../Domain/Interface/EntrepreneurInterface'
import { Entrepreneur } from '../../Domain/entities/entrepreneurentities'



export class entrepreneurRepository implements IEntrepreneurRepository{
  async findbyEmail(email: string): Promise<IEntrepreneurdata | null> {
         return (await Entrepreneurmodel.findOne({email})) as IEntrepreneurdata 
    }
    async  getbyId(id: string): Promise<IEntrepreneurdata | null> {
        try {
            return await Entrepreneurmodel.findOne({_id:id}) 
        } catch (error) {
            throw new Error("error in db")

        }
    }
    async saveentrepreneur(user: Entrepreneur): Promise<IEntrepreneurdata> {
        try {
            const createEntrepreneur = new Entrepreneurmodel(user)
            return (await createEntrepreneur.save()) as IEntrepreneurdata;
        } catch (error) {
            throw new Error("error occure while save entreprenuer")
        }
    }

    async update(user: Partial<Entrepreneur>): Promise<IEntrepreneurdata> {
        try {
            // Update the entrepreneur by their unique email
            const updatedEntrepreneur = await Entrepreneurmodel.findOneAndUpdate(
                { email: user.email },  // Using email to find the user
                { firstname: user.firstname,lastname:user.lastname, phone: user.phone },  // Only update the fields provided
                { new: true }  // To return the updated document
            );
    
            if (!updatedEntrepreneur) {
                throw new Error("Failed to update entrepreneur: User not found");
            }
    
            return updatedEntrepreneur as IEntrepreneurdata;
        } catch (error) {
            console.error("Error while updating entrepreneur:", error);
            throw new Error("Error occurred while updating entrepreneur");
        }
    }
    
    

}