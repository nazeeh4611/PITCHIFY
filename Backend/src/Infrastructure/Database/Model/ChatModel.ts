import mongoose from 'mongoose';
import { IChatData } from '../../../Domain/entities/Chatentity';

const ChatSchema = new mongoose.Schema<IChatData>({
    chatname: { 
        type: String 
    },
    entrepreneur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Entrepreneur',
        required: true 
    },
    investor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Investor',
        required: true 
    },
    latestmessage: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Message' 
    }],
    relatedModel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BusinessModel' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

export default mongoose.model<IChatData>('Chat', ChatSchema);