"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genarateOtp = genarateOtp;
function genarateOtp() {
    let otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    return otp;
}
