    import {Iadminrepository} from "../Domain/Interface/AdminInterface"
    import {Premium} from "../Domain/entities/Premiumentity"


    export class Addplanusecase{
        async execute(planName:string,description:string,planPrice:number,Duration:number){


            const plan = new Premium({
                planName,
                planPrice,
                Duration,
                description
            })


            await plan.save();
            return plan.toPlanData()

        }
    }