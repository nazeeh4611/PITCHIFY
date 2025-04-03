"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEntrpreneurUsecase = void 0;
class GetEntrpreneurUsecase {
    constructor(getEntreprenueRepo) {
        this.getEntreprenueRepo = getEntreprenueRepo;
    }
    async execute() {
        try {
            return await this.getEntreprenueRepo.getAllEntrepreneur();
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.GetEntrpreneurUsecase = GetEntrpreneurUsecase;
