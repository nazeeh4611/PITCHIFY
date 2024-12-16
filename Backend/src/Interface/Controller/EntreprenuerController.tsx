
import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

import { signupUsecase } from '../../Usecase/SignupUsecase'
import { Types } from 'mongoose'
import { json } from 'body-parser'

export class EntrepreneurController{

    constructor(
        private signupusecase:signupUsecase,
    ) {

    }


    async signup(req:Request,res:Response,next:NextFunction):Promise <void>{

        const {firstname,lastname,phone,email,password,confirmpassword} = req.body

     
        try {
          const user = await this.signupusecase.execute(
            firstname,
            lastname,
            email,
            phone,
            password,
            confirmpassword
          )   

          res.status(200).json({success:true,user})
        } catch (error) {
        res.status(404)
        console.log("error")   
        }
    }
}