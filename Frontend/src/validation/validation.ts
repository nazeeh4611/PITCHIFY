import { emailregex,phoneregex,passwordRegex,confirmpasswordRegex } from "../Constent/regex";


export const inputValidation = (name: string ,value:string| undefined): string => {
    let error = "";

    switch(name){
        case "firstname":
            if(!value){
                error = "firstname is required"
            }
            break;

        case "lastname":
            if(!value){
                error = "lastname required"
            }
            break;
         
        case "email":
            if(!value){
                error = "email required"
            } else if (!emailregex.test(value as string)){
                error = "please enter a valid email"
            }  
            break;

        case "phone":
            if(!value){
                error = "phone is required"
            }else if(!phoneregex.test(value as string)){
                error = "please enter a valid mobile number"
            } 
             break;
             
        case "password":
            if(!value){
                error = "password is required"
            }else if(!passwordRegex.test(value as string)){
                error = "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character"
            }     
            break;

        case "confirmpassword":
            if(!value){
                error = "confirmpassword required"
            }else if(!confirmpasswordRegex.test(value as string)){
                error = "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character"
            }    
            break;

            default:
            break;

        

    }

    return error

}


export interface Formerrors{
    firstname?:string;
    lastname?:string;
    email?:string;
    phone?:string;
    password?:string;
    confirmpassword?:string;
}


export const hasFormerror = (errors:Formerrors):boolean =>{
    return Object.values(errors).some((error)=>error!=="")
}

export const isFormEmpty = (formData:Record<string,string>):boolean =>{
    return Object.values(formData).some((field)=>field=="")
}

