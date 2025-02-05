export const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneregex = /^\d{10}$/;
export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const confirmpasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const baseurl = `http://localhost:3009/api`