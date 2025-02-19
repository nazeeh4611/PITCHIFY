import { IInvestordata } from "../Domain/entities/Investorentity";
import { IInvestorRepository } from "../Domain/Interface/InvestorInterface";

import fs from 'fs'; 
export class Investorverifyusecase {
  constructor(
    private investorrepository: IInvestorRepository
  ) {}

  async execute(email: string, companydetails: string,status:string,companyName:string): Promise<IInvestordata> {
    try {

      const verifyinvestor = await this.investorrepository.verifyinvestor(email, companydetails,status,companyName);
      if (!verifyinvestor) {
        throw new Error("Failed to find investor with the provided email");
      }
      return verifyinvestor;
    } catch (error) {
      console.error("Error in investor verification:", error);
      throw new Error("Error occurred during investor verification");
    }
  }
}

