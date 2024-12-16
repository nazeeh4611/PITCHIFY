import { Entrepreneur } from "../Domain/entities/entrepreneurentities";




type SignupResponse = Entrepreneur | {message:string};

export class signupUsecase{


    async execute(firstname:string,secondname:string,email:string,phone:number,password:string,confirmpassword:string){
        console.log("the datas reached here")
    }
}