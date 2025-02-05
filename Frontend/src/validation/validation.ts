// import { emailregex,phoneregex,passwordRegex,confirmpasswordRegex } from "../Constent/regex";

import * as Yup from "yup";

// export const inputValidation = (name: string ,value:string| undefined): string => {
//     let error = "";

//     switch(name){
//         case "firstname":
//             if(!value){
//                 error = "firstname is required"
//             }
//             break;

//         case "lastname":
//             if(!value){
//                 error = "lastname required"
//             }
//             break;
         
//         case "email":
//             if(!value){
//                 error = "email required"
//             } else if (!emailregex.test(value as string)){
//                 error = "please enter a valid email"
//             }  
//             break;

//         case "phone":
//             if(!value){
//                 error = "phone is required"
//             }else if(!phoneregex.test(value as string)){
//                 error = "please enter a valid mobile number"
//             } 
//              break;
             
//         case "password":
//             if(!value){
//                 error = "password is required"
//             }else if(!passwordRegex.test(value as string)){
//                 error = "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character"
//             }     
//             break;

//         case "confirmpassword":
//             if(!value){
//                 error = "confirmpassword required"
//             }else if(!confirmpasswordRegex.test(value as string)){
//                 error = "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character"
//             }    
//             break;

//             default:
//             break;

        

//     }

//     return error

// }


// export interface Formerrors{
//     firstname?:string;
//     lastname?:string;
//     email?:string;
//     phone?:string;
//     password?:string;
//     confirmpassword?:string;
// }


// export const hasFormerror = (errors:Formerrors):boolean =>{
//     return Object.values(errors).some((error)=>error!=="")
// }

// export const isFormEmpty = (formData:Record<string,string>):boolean =>{
//     return Object.values(formData).some((field)=>field=="")
// }


export const validationSchema = Yup.object({
  firstname: Yup.string().required("First Name is required"),
  lastname: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")  // Fixed here by removing `null`
    .required("Confirm Password is required"),
});

