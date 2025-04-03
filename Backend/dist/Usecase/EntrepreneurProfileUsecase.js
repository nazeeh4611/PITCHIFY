"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneuProfileUsecase = void 0;
class EntrepreneuProfileUsecase {
    constructor(Entrepreneurrepository) {
        this.Entrepreneurrepository = Entrepreneurrepository;
    }
    async execute(email) {
        try {
            const entrepreneur = await this.Entrepreneurrepository.findbyEmail(email);
            return {
                entrepreneur
            };
        }
        catch (error) {
            console.error("error occured in find data ");
        }
    }
}
exports.EntrepreneuProfileUsecase = EntrepreneuProfileUsecase;
