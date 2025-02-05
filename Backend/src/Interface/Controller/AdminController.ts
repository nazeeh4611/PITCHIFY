import {Request,Response,NextFunction, response} from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";


import { AdminLoginUsecase,
    GetEntrpreneurUsecase,
    GetInvestorUsecase,
    EntrepreneurBlockusecase,
    CategoryUsecase,
    GetCategoryUsecase,
    EditcategoryUsecase,
    categoryListingUsecase,
    AdminInvestorDetailsusecase,
    InvestorstatusUsecase,
    Addplanusecase,
    Getplanusecase
} from "../../Usecase";
import { Types } from "mongoose";

export class AdminController {
    constructor(
        private loginusecase:AdminLoginUsecase,
        private getInvestorusecase:GetInvestorUsecase,
        private getEntrepreneurusecase:GetEntrpreneurUsecase,
        private entreprenuerblockusecase:EntrepreneurBlockusecase,
        private addcategoryusecase:CategoryUsecase,
        private getcategoryusecase:GetCategoryUsecase,
        private editcategoryusecase:EditcategoryUsecase,
        private categorylistusecase:categoryListingUsecase,
        private investordetailsusecase:AdminInvestorDetailsusecase,
        private statususecase:InvestorstatusUsecase,
        private addplanusecase:Addplanusecase,
        private getplanusecase:Getplanusecase
    ){}


    async adminLogin(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {email,password} = req.body
            if(!email || !password ){
                res.status(400).json({success:false,message:"email and password required"})
                return
            }
            const response = await this.loginusecase.execute(email,password)
            const token = response.token
            res.status(200).json({success:true,token})
        } catch (error) {
            console.error(error)
            res.status(500).json({success:false,message:"internal server error"})
        }
    }


    async getInvestor(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
           const InvestorData = await this.getInvestorusecase.execute();
           if(InvestorData){
            res.status(200).json(InvestorData)
           }else{
            res.status(404).json({suceess:false,message:"investor data not found"})
           }
        } catch (error) {
            console.error(error)
            res.status(500).json({success:false,message:"internal server error"})
        }
    }

    async InvestorDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.query.id;
    
            if (typeof id === 'string') {
                const response = await this.investordetailsusecase.execute(id);
                res.status(200).json(response)
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
        } catch (error) {
            next(error);
        }
    }


    async InvestorVerify(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {status,email} =req.body
            console.log(status,email,"eii")

            const response = await this.statususecase.execute(status,email)
            console.log(response)
            res.status(200).json(response)
        } catch (error) {
            
        }
    }
    

    async getEntrepreneur(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const EntrepreneurData = await this.getEntrepreneurusecase.execute();
           
            if(EntrepreneurData){
                res.status(200).json(EntrepreneurData)
            }else{
                res.status(404).json({success:false,message:"Entrepreneur data not found"})
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({success:false,message:"Internal server error"})
        }
}

   async blockEntrepreneur(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        
        const email = req.body.email
        const response = await this.entreprenuerblockusecase.execute(email)
        if(response){

            res.status(200).json({success:true,message:"user blocked"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:"Internal server error"})
    }
   } 

   async AddCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const categoryname = req.body.name;
        const file = (req.file as Express.MulterS3.File).location;
        
        if (!categoryname || !file) {
            res.status(400).json({ success: false, message: "Category name and file are required" });
            return;
        }

        const response = await this.addcategoryusecase.execute(categoryname, file);
        
        if (response.success) {
            res.status(200).json({ success: true, message: "Category added", data: response.data });
        } else {
            res.status(400).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Error in AddCategory:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

   async GetCategory(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const response =  await this.getcategoryusecase.execute();
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
    }
   }

   async EditCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {id,name} = req.body;
        const image = (req.file as Express.MulterS3.File).location;

         

        const response  = await this.editcategoryusecase.execute(name,image,id)
        res.status(200).json(response)

       
    } catch (error) {
        console.error("Error in EditCategory:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


   async listcategory(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const id = req.body.categoryId
        const response = await this.categorylistusecase.execute(id)
         res.status(200).json({success:true})
                   
    } catch (error) {
        
    }
   }

   async addPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, duration, price, description } = req.body;

        if (!name || !duration || !price || !description) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }

        const response = await this.addplanusecase.execute(name, description, price, duration);

        console.log(response, "respo");

        res.status(200).json({
            success: true,
            message: "Plan added successfully",
            data: response
        });
    } catch (error) {
        console.error("Error in addPlan:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


  async getPlans(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const response = await this.getplanusecase.execute()
        console.log(response,"this be the response for plans")
        res.status(200).json(response)
    } catch (error) {
        
    }
  }

}