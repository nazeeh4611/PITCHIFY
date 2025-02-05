import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"
import { generateToken, generateRefreshToken } from '../Interface/Middleware/tokenauth';
import {verifypass} from "../Infrastructure/Utils/hashpass"


export class InvestorLoginUsecase { 
    constructor(
        private loginRepository : IInvestorRepository
    ) {}
    
    async execute(email:string,password:string):Promise<any>{
        if(!email || !password){
            return {success:false,message:"email and password required"}
        }
    
        const Investor = await this.loginRepository.findbyEmail(email);
    
        if(!Investor){
            return {success:false,message:"invalid email"}
        }
    
    
        if(Investor.is_Blocked == true){
            return {success:false,message:"acount is bloacked"}
        }
    
        const ispassValid = await verifypass(password,Investor.password);
    
        if(!ispassValid){
            return {success:false,message:"Invalid pasword"}
        }
    
        const tokenPayload = { id: Investor._id.toString(), email,role:"investor" };
        const token = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);
        
    
       return {
        success:true,
        Investor,
        token,
        refreshToken
       }
    
    }
    
    
    
    }