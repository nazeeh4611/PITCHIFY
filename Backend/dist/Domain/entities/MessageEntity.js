"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
class Message {
    constructor(data) {
        this._id = data._id || new mongoose_1.Types.ObjectId();
        this.chat = data.chat;
        this.sender = data.sender;
        this.reciever = data.reciever;
        this.content = data.content;
        this.createdAt = data.createdAt || new Date();
    }
}
exports.Message = Message;
