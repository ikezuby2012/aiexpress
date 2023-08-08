"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetSms = exports.sendOtpSms = void 0;
const config_1 = __importDefault(require("../../config"));
const { sid, AuthToken, twilioNumber } = config_1.default.twilio;
const accountSid = sid;
const authToken = AuthToken;
const client = require("twilio")(accountSid, authToken);
const sendOtpSms = (otp, phoneNumber) => {
    client.messages
        .create({
        body: `aiexpress verification code --- ${otp}`,
        to: phoneNumber,
        from: twilioNumber, // From a valid Twilio number
    })
        .then((message) => console.log(message.sid));
};
exports.sendOtpSms = sendOtpSms;
const sendPasswordResetSms = (otp, phoneNumber) => {
    client.messages
        .create({
        body: `aiexpress password reset code --- ${otp}`,
        to: phoneNumber,
        from: twilioNumber, // From a valid Twilio number
    })
        .then((message) => console.log(message.sid));
};
exports.sendPasswordResetSms = sendPasswordResetSms;
