"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurGetMessageUsecase = void 0;
class EntrepreneurGetMessageUsecase {
    constructor(messagerepo) {
        this.messagerepo = messagerepo;
    }
    async execute(chatId) {
        const message = await this.messagerepo.getMessagesByChatId(chatId);
        return message;
    }
}
exports.EntrepreneurGetMessageUsecase = EntrepreneurGetMessageUsecase;
