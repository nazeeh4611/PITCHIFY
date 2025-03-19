import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"
import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"
import { generateRefreshToken, generateToken } from "../Interface/Middleware/tokenauth";
import { EntrepreneurModel,InvestorModel } from "../Infrastructure/Database/Model";
import { Types } from "mongoose";
import { Investor } from "../Domain/entities/Investorentity";


export class GoogleAuthUsecase{
    constructor(
        private investorrepo:IInvestorRepository,
        private entrepreneurrepo:IEntrepreneurRepository
    ){}


    async execute(token:string,user:string){
        try {

            const payload = JSON.parse(atob(token.split('.')[1]));

            const email = payload.email
            if(user == "entrepreneur"){
             
                const entrepreneur = await this.entrepreneurrepo.findbyEmail(email)
                if(!entrepreneur){
                    const entrepreneur = new EntrepreneurModel({
                        _id: new Types.ObjectId(),
                        firstname: payload.given_name,
                        lastname: payload.family_name,
                        email,
                        password: "defaultPassword", 
                        confirmpassword: "defaultPassword",
                        phone: "0000000000",  
                    });
                    

                      await entrepreneur.save()
                    const tokenPayload = { id: entrepreneur?._id.toString(), email,role:"entrepreneur" };
                    const token = generateToken(tokenPayload);
                    const refreshToken = generateRefreshToken(tokenPayload);
                    return {
                        success:true,
                        entrepreneur,
                        token,
                        refreshToken
                       }
                }else{
                    const tokenPayload = { id: entrepreneur?._id.toString(), email,role:"entrepreneur" };
                    const token = generateToken(tokenPayload);
                    const refreshToken = generateRefreshToken(tokenPayload);
                    return {
                        success:true,
                        entrepreneur,
                        token,
                        refreshToken
                       }
                }
            }else if(user == "investor"){

           const investor = await this.investorrepo.findbyEmail(email)

           if(!investor){
            const investor = new InvestorModel({
                _id:new Types.ObjectId(),
                firstname:payload.given_name,
                lastname:payload.family_name,
                email,
                password: "defaultPassword", 
                confirmpassword: "defaultPassword",
                phone: "0000000000",  

            })

            await investor.save()

             const tokenPayload = { id: investor?._id.toString(), email,role:"investor" };
            const token = generateToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);
            return {
                success:true,
                investor,
                token,
                refreshToken
               }
           }else{
            const tokenPayload = { id: investor?._id.toString(), email,role:"investor" };
            const token = generateToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);
            return {
                success:true,
                investor,
                token,
                refreshToken
               }

        }
           }

            }catch (error) {
            console.error(error)
        }
    }
}