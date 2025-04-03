"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReciever = void 0;
class getReciever {
    constructor(investorepo) {
        this.investorepo = investorepo;
    }
    async execute(id) {
        const result = await this.investorepo.getReciever(id);
        return result;
    }
}
exports.getReciever = getReciever;
