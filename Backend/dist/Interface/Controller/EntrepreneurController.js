"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurController = void 0;
const Stripe_1 = require("../../Infrastructure/Utils/Stripe");
const mongoose_1 = require("mongoose");
class EntrepreneurController {
    constructor(signupusecase, verifyotpusecase, loginusecase, profileusecase, editProfileUsecase, getcategoryusecase, addmodelusecase, getmodelusecase, modeldetails, editmodelusecase, getplanusecase, premiumusecase, getchatusecase, getmessageusecase, sendmessagusecase, getinvestorusecase, createChatusecase, googleauthusecase) {
        this.signupusecase = signupusecase;
        this.verifyotpusecase = verifyotpusecase;
        this.loginusecase = loginusecase;
        this.profileusecase = profileusecase;
        this.editProfileUsecase = editProfileUsecase;
        this.getcategoryusecase = getcategoryusecase;
        this.addmodelusecase = addmodelusecase;
        this.getmodelusecase = getmodelusecase;
        this.modeldetails = modeldetails;
        this.editmodelusecase = editmodelusecase;
        this.getplanusecase = getplanusecase;
        this.premiumusecase = premiumusecase;
        this.getchatusecase = getchatusecase;
        this.getmessageusecase = getmessageusecase;
        this.sendmessagusecase = sendmessagusecase;
        this.getinvestorusecase = getinvestorusecase;
        this.createChatusecase = createChatusecase;
        this.googleauthusecase = googleauthusecase;
    }
    async signup(req, res, next) {
        const { firstname, lastname, phone, email, password, confirmpassword } = req.body;
        if (!firstname || !lastname || !phone || !email || !password || !confirmpassword) {
            res.status(404).json({ success: false, message: "firstname, lastname, phone, email, password, confirmpassword are required" });
        }
        try {
            const entrepreneur = await this.signupusecase.execute(firstname, lastname, email, phone, password, confirmpassword, res);
            res.status(200).json({ success: true, entrepreneur });
        }
        catch (error) {
            console.error("Error during signup:", error);
            res.status(500).json({ sucsess: false, message: "Internal server error" });
            next(error);
        }
    }
    async verifyotp(req, res, next) {
        try {
            const { otp, emaildata } = req.body;
            if (!otp || !emaildata) {
                res.status(400).json({ success: false, message: "otp and email required" });
            }
            // const decodedEmail = decodeURIComponent(emaildata); 
            // const bytes = CryptoJS.AES.decrypt(decodedEmail, "emailsecret");
            // const email = bytes.toString(CryptoJS.enc.Utf8);
            const email = emaildata;
            if (!email) {
                throw new Error("Failed to decrypt email or email is empty.");
            }
            const response = await this.verifyotpusecase.execute(Number(otp), email);
            if (response) {
                const token = response.token;
                res.status(200).json({ success: true, message: "otp verified", token });
            }
        }
        catch (error) {
            console.error("Error during OTP verification:", error);
            res.status(500).json({ sucsess: false, message: "Internal server error" });
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ success: false, message: "email and password required" });
            }
            const response = await this.loginusecase.execute(email, password);
            if (response) {
                const token = response.token;
                const refreshToken = response.refreshToken;
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({ sucess: true, token });
            }
        }
        catch (error) {
            console.error(error, "error occured in login");
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async googleLogin(req, res, next) {
        try {
            const { email, token, user } = req.body;
            const response = await this.googleauthusecase.execute(token, user);
            if (response) {
                const token = response.token;
                const refreshToken = response.refreshToken;
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({ sucess: true, token });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getProfile(req, res, next) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const response = await this.profileusecase.execute(email);
            if (response) {
                res.status(200).json({
                    message: "Profile fetched successfully",
                    entrepreneur: response.entrepreneur,
                });
            }
            else {
                res.status(404).json({ message: "Profile not found" });
            }
        }
        catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ message: "Internal server error" });
            next(error);
        }
    }
    async editProfile(req, res, next) {
        try {
            const updatedProfile = req.body;
            const email = updatedProfile.email;
            const phone = updatedProfile.phone;
            const fname = updatedProfile.firstname;
            const lname = updatedProfile.lastname;
            const image = req.file.location;
            console.log(image);
            console.log("opopoo", email);
            const response = await this.editProfileUsecase.execute(email, fname, lname, phone, image);
            console.log("upadted");
            res.status(200).json({ success: false, message: "data is updated" });
        }
        catch (error) {
            res.status(500).json({ success: false, message: "internal server error" });
        }
    }
    async getcategory(req, res, next) {
        try {
            const response = await this.getcategoryusecase.execute();
            res.status(200).json({ success: true, data: response });
        }
        catch (error) {
            next(error);
        }
    }
    async addmodel(req, res, next) {
        try {
            const { businessName, tagline, industryFocus, targetAudience, problemStatement, solution, teamExpertise, useOfFunds, location, marketOpportunities, fundingGoal, email } = req.body;
            const pitchvideo = req.file.location;
            const response = await this.addmodelusecase.execute(businessName, tagline, industryFocus, targetAudience, problemStatement, solution, teamExpertise, useOfFunds, location, marketOpportunities, fundingGoal, email, pitchvideo);
            res.status(200).send({ message: 'Model added successfully', data: req.body });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error adding model' });
        }
    }
    async getmodal(req, res, next) {
        try {
            const email = req.body.email;
            const response = await this.getmodelusecase.execute(email);
            res.status(200).json(response);
        }
        catch (error) {
            console.error("Error in getmodal:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async getmodeldetails(req, res, next) {
        try {
            const modelid = req.params.id;
            const response = await this.modeldetails.execute(new mongoose_1.Types.ObjectId(modelid));
            res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async editmodel(req, res, next) {
        try {
            const { businessName, tagline, fundinggoal, problemStatement, solution, targetAudience, marketOpportunities, useOfFunds, location, teamexpertise, pitchvideo } = req.body;
            const category = req.body.industryFocus._id;
            const industryFocus = new mongoose_1.Types.ObjectId(category);
            const id = req.params.id;
            const response = await this.editmodelusecase.execute(new mongoose_1.Types.ObjectId(id), {
                businessName,
                tagline,
                fundinggoal,
                industryFocus,
                problemStatement,
                solution,
                targetAudience,
                marketOpportunities,
                useOfFunds,
                location,
                teamexpertise,
                pitchvideo
            });
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
    async subscription(req, res, next) {
        try {
            const { amount, currency, id, duration, email } = req.body;
            const startdate = new Date();
            const enddate = new Date(startdate);
            enddate.setMonth(startdate.getMonth() + duration);
            const paymentIntent = await Stripe_1.stripe.paymentIntents.create({
                amount,
                currency,
            });
            const response = await this.premiumusecase.execute(id, startdate, enddate, email);
            if (response) {
                res.status(200).json({ clientSecret: paymentIntent.client_secret });
            }
        }
        catch (error) {
            console.error("Error creating payment intent:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getplan(req, res, next) {
        try {
            const response = await this.getplanusecase.execute();
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
    async getChat(req, res, next) {
        try {
            const email = req.params.email;
            const response = await this.getchatusecase.execute(email);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(200).json({ message: "Internal server error" });
        }
    }
    async getMessage(req, res, next) {
        try {
            const chatId = req.params.chatId;
            const response = await this.getmessageusecase.execute(new mongoose_1.Types.ObjectId(chatId));
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async sendMessage(req, res, next) {
        try {
            const { sender, chatId, message, receiverId, timestamp } = req.body;
            const data = {
                chatId,
                senderId: sender,
                receiverId,
                content: message,
                createdAt: timestamp
            };
            const response = await this.sendmessagusecase.execute(data);
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
    async getInvestors(req, res, next) {
        try {
            const response = await this.getinvestorusecase.execute();
            res.status(200).json(response);
        }
        catch (error) {
        }
    }
    async createChat(req, res, next) {
        try {
            const { entrepreneurId, investorId } = req.body;
            const { chatId } = await this.createChatusecase.execute({
                entrepreneurId,
                investorId,
            });
            if (!chatId) {
                res.status(500).json({
                    message: "Failed to create or find chat"
                });
                return;
            }
            res.status(201).json({ chatId });
        }
        catch (error) {
            console.error("Chat Creation Controller Error:", error);
            res.status(500).json({
                message: "Error creating chat",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.EntrepreneurController = EntrepreneurController;
