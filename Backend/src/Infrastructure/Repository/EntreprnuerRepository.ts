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
}