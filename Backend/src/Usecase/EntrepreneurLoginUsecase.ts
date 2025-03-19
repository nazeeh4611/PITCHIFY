import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"
import { generateToken, generateRefreshToken } from '../Interface/Middleware/tokenauth';
import {verifypass} from "../Infrastructure/Utils/hashpass"


export class EntrepreneurLoginUsecase { 
constructor(
    private loginRepository : IEntrepreneurRepository
) {}

async execute(email:string,password:string):Promise<any>{
    if(!email || !password){
        return {success:false,message:"email and password required"}
    }

    const entrepreneur = await this.loginRepository.findbyEmail(email);

    if(!entrepreneur){
        return {success:false,message:"invalid email"}
    }


    if(entrepreneur.is_Blocked == true){
        return {success:false,message:"acount is blocked"}
    }

    const ispassValid = await verifypass(password,entrepreneur.password);

    if(!ispassValid){
        return {success:false,message:"Invalid pasword"}
    }

    const tokenPayload = { id: entrepreneur._id.toString(), email,role:"entrepreneur" };
    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    

   return {
    success:true,
    entrepreneur,
    token,
    refreshToken
   }

}



}