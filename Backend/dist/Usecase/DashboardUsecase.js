"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DahboardUsecase = void 0;
class DahboardUsecase {
    constructor(adminrepo) {
        this.adminrepo = adminrepo;
    }
    async execute() {
        const details = await this.adminrepo.DashboardDetails();
        console.log(details, "may in usecase");
        return details;
    }
}
exports.DahboardUsecase = DahboardUsecase;
