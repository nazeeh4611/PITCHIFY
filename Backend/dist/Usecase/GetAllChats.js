"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllchatusecase = void 0;
class getAllchatusecase {
    constructor(chatrepo) {
        this.chatrepo = chatrepo;
    }
    async execute(id) {
        const result = await this.chatrepo.getAll(id);
        console.log(result);
        return result;
    }
}
exports.getAllchatusecase = getAllchatusecase;
