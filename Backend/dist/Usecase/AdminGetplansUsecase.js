"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Getplanusecase = void 0;
class Getplanusecase {
    constructor(adminrepo) {
        this.adminrepo = adminrepo;
    }
    async execute() {
        try {
            return this.adminrepo.getAllpremium();
        }
        catch (error) {
        }
    }
}
exports.Getplanusecase = Getplanusecase;
