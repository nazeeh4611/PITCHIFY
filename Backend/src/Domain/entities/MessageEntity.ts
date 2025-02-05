import { Types } from 'mongoose';

export interface IMessage {
    _id?: Types.ObjectId;
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    reciever:Types.ObjectId;
    content: string;
    createdAt?: Date;
    isRead?: boolean;
}


export class Message {
    _id: Types.ObjectId;
    chat?:Types.ObjectId;
    sender?: Types.ObjectId;
    reciever?:Types.ObjectId
    content?:string;
    createdAt?: Date;
    isRead?:boolean;


    constructor(data: Partial<IMessage>) {
        this._id = data._id || new Types.ObjectId();
        this.chat = data.chat;
        this.sender = data.sender;
        this.reciever = data.reciever;
        this.content = data.content;
        this.createdAt = data.createdAt || new Date();
    }

}