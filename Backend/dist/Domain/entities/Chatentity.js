"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
class Chat {
    constructor(data) {
        if (!data.entrepreneur || !data.investor) {
            throw new Error("Entrepreneur and Investor IDs are required");
        }
        this._id = data._id || new mongoose_1.Types.ObjectId();
        this.chatname = data.chatname;
        this.entrepreneur = data.entrepreneur;
        this.investor = data.investor;
        this.latestmessage = data.latestmessage || [];
        this.relatedModel = data.relatedModel;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }
    updateLatestMessage(messageId) {
        if (!this.latestmessage) {
            this.latestmessage = [];
        }
        this.latestmessage.push(messageId);
        this.updatedAt = new Date();
    }
}
exports.Chat = Chat;
