import {verifypass} from "../Infrastructure/Utils/hashpass"
import { Iadminrepository } from "../Domain/Interface/AdminInterface"
import { generateToken, generateRefreshToken } from '../Interface/Middleware/tokenauth';



export class AdminLoginUsecase {
    constructor (
        private loginRepository:Iadminrepository     
    ) {}

    async execute(email:string,password:string):Promise<any>{
        console.log(email,password,"email password")
        if(!email || !password){
            return {success:false,message:"email and password required"}
        }

        const admin = await this.loginRepository.findEmail(email)

        if(!admin){
            console.log("admin does not exist plase make admin")
        }

        if(admin?.is_Admin){
            const ispassValid = await verifypass(password,admin.password)
            if(!ispassValid){
                return {success:false,message:"invalid password"};
            }

            const tokenPayload = { id: admin._id.toString(), email };
            const token = generateToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);

            return {
                admin,
                token,
                refreshToken
            }
        }
        return {success:false,message:"you are not admin"}
    }

    
}