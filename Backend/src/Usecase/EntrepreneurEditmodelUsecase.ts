import { Types } from "mongoose";
import { IEntrepreneurRepository } from "../Domain/Interface/EntrepreneurInterface";

export class Editmodelusecase {
  constructor(private entrepreneurrepo: IEntrepreneurRepository) {}

  async execute(
    id: Types.ObjectId,
    {
      businessName,
      tagline,
      fundinggoal,
      industryFocus,
      problemStatement,
      solution,
      targetAudience,
      marketOpportunities,
      useOfFunds,
      location,
      teamexpertise,
      pitchvideo,
    }: Partial<{
      businessName: string;
      tagline: string;
      fundinggoal: string;
      industryFocus: Types.ObjectId;
      problemStatement: string;
      solution: string;
      targetAudience: string;
      marketOpportunities: string;
      useOfFunds: string;
      location:string;
      teamexpertise: string;
      pitchvideo: string;
    }>
  ) {
    try {
      const updatedModel = await this.entrepreneurrepo.editmodel(
        {
          businessName,
          tagline,
          fundinggoal,
          industryFocus,
          problemStatement,
          solution,
          targetAudience,
          marketOpportunities,
          useOfFunds,
          location,
          teamexpertise,
          pitchvideo,
        },
        id
      );


      if (!updatedModel) {
        throw new Error("Failed to update model.");
      }

      return updatedModel;
    } catch (error) {
      console.error("Error in Editmodelusecase execute:", error);
      throw new Error("Error while executing the Editmodelusecase.");
    }
  }
}
