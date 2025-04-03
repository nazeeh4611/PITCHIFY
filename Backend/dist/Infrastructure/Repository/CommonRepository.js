"use strict";
// import { IPremium} from "../../Domain/entities";
// import {PremiumModel} from "../Database/Model";
// import { ICommonRepository } from "../../Domain/Interface/CommonInterface";
// export class CommonRepository implements ICommonRepository {
//     async getAllpremium(): Promise<IPremium[] | null> {
//         try {
//           const plans = await PremiumModel.find().lean<IPremium[]>();
//           console.log(plans,"this be the plans in repo")
//           return plans.length > 0 ? plans : null;
//         } catch (error) {
//           console.error("Error occurred in getAllpremium:", error);
//           return null; // Explicitly return null in case of an error
//         }
//       }
// }
