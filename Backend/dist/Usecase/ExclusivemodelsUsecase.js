"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclusivemodelUsecase = void 0;
class exclusivemodelUsecase {
    constructor(investorrepo) {
        this.investorrepo = investorrepo;
    }
    async execute() {
        const data = await this.investorrepo.exclusiveModel();
        console.log(data);
        return data;
    }
}
exports.exclusivemodelUsecase = exclusivemodelUsecase;
