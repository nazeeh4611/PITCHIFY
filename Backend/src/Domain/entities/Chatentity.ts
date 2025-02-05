import { Types } from "mongoose";

export interface IChatData {
    _id?: Types.ObjectId;
    chatname?: string;
    entrepreneur: Types.ObjectId;
    investor: Types.ObjectId;
    latestmessage?: Types.ObjectId[]; 
    relatedModel?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Chat {
    _id: Types.ObjectId;
    chatname?: string;
    entrepreneur: Types.ObjectId;
    investor: Types.ObjectId;
    latestmessage?: Types.ObjectId[]; 
    relatedModel?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<IChatData>) {
        if (!data.entrepreneur || !data.investor) {
            throw new Error("Entrepreneur and Investor IDs are required");
        }

        this._id = data._id || new Types.ObjectId();
        this.chatname = data.chatname;
        this.entrepreneur = data.entrepreneur;
        this.investor = data.investor;
        this.latestmessage = data.latestmessage || []; 
        this.relatedModel = data.relatedModel;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    updateLatestMessage(messageId: Types.ObjectId): void {
        if (!this.latestmessage) {
            this.latestmessage = [];
        }
        this.latestmessage.push(messageId);
        this.updatedAt = new Date();
    }
}
