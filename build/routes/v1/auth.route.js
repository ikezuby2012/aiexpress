"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../../modules/Auth");
const validate_1 = require("../../modules/validate");
const router = express_1.default.Router();
router.post("/register", (0, validate_1.validate)(Auth_1.authValidation.register), Auth_1.authController.register);
router.post("/login", (0, validate_1.validate)(Auth_1.authValidation.login), Auth_1.authController.login);
router.post("/logout", (0, validate_1.validate)(Auth_1.authValidation.logout), Auth_1.authController.logout);
router.post("/verify-account", (0, validate_1.validate)(Auth_1.authValidation.verifyAccount), Auth_1.authController.verifyEmail);
router.get("/resend-otp/:id", Auth_1.authController.regenerateOtp);
router.post("/forgotpassword", Auth_1.authController.forgotPassword);
router.post("/resetpassword", (0, validate_1.validate)(Auth_1.authValidation.resetPassword), Auth_1.authController.resetPassword);
exports.default = router;
