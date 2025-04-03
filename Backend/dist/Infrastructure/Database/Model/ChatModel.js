"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    chatname: {
        type: String
    },
    entrepreneur: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Entrepreneur',
        required: true
    },
    investor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    latestmessage: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Message'
        }],
    relatedModel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Chat', ChatSchema);
