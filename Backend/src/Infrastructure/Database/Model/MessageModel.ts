import mongoose, { Types } from 'mongoose';

export interface IMessage {
    _id?: Types.ObjectId;
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    reciever:Types.ObjectId
    content: string;
    createdAt?: Date;
    isRead?: boolean;
}

const MessageSchema = new mongoose.Schema<IMessage>({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reciever:{
       type:mongoose.Schema.Types.ObjectId
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);