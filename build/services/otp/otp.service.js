"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateOtp = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const secret = speakeasy_1.default.generateSecret({ length: 20 });
/**
 * Generate one-time password
 * @returns {String}
 */
const generateOtp = () => {
    return speakeasy_1.default.totp({
        secret: secret.base32,
        encoding: "base32",
        step: 600,
    });
};
exports.generateOtp = generateOtp;
/**
 * verify OTP
 * @param {string} token
 * @returns {boolean}
 */
const verifyOtp = (token) => {
    return speakeasy_1.default.totp.verify({
        secret: secret.base32,
        encoding: "base32",
        token,
        step: 600,
        window: 2,
    });
};
exports.verifyOtp = verifyOtp;
