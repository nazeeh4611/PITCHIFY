    import { Types } from "mongoose";
    import { PremiumModel } from "../../Infrastructure/Database/Model"; // Adjust path as needed

    export interface IPremium {
        _id: Types.ObjectId;
        planName: string;
        planPrice: number;
        Duration:number;
        description:string;
        users:number;
    }
    export class Premium implements IPremium {
        _id: Types.ObjectId;
        planName: string;
        planPrice: number;
        Duration:number;
        description:string;
        users: number;

        constructor(data: Partial<IPremium>) {
            this._id = data._id || new Types.ObjectId();
            this.planName = data.planName!;
            this.planPrice = data.planPrice!;
            this.Duration = data.Duration!;
            this.description = data.description!;
            this.users = data.users!
        }

        toPlanData(): IPremium {
            return {
                _id: this._id,
                planName: this.planName,
                planPrice: this.planPrice,
                Duration: this.Duration,
                description:this.description,
                users:this.users
            };
        }

        async save(): Promise<Premium> {
            const PremiumData = this.toPlanData();
            const Premium = new PremiumModel(PremiumData);
            console.log("data saved to db")
            await Premium.save();
            console.log(this)
            return this;
        }
    }
