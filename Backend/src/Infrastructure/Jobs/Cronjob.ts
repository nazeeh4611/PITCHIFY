import cron from "node-cron";
import {EntrepreneurModel,InvestorModel} from "../Database/Model";



cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
  
      const result = await EntrepreneurModel.updateMany(
        { "premium.endDate": { $lt: now } },
        { $unset: { premium: "" } }
      );
  
      console.log(`Removed premium plans from ${result.modifiedCount} entrepreneurs`);
    } catch (error) {
      console.error("Error in entrepreneur cron job:", error);
    }
  });
  
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
  
      const result = await InvestorModel.updateMany(
        { "premium.endDate": { $lt: now } }, 
        { $unset: { premium: "" } }
      );
  
      console.log(`Removed premium plans from ${result.modifiedCount} investors`);
    } catch (error) {
      console.error("Error in investor cron job:", error);
    }
  });
  


