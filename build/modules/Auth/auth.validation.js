"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccount = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.register = void 0;
const custom_validation_1 = require("../validate/custom.validation");
const Joi = require("joi");
const registerBody = {
    password: Joi.string().required().custom(custom_validation_1.password),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
};
exports.register = {
    body: Joi.object().keys(registerBody),
};
exports.login = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required(),
    }),
};
exports.logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};
exports.refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};
exports.forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};
exports.resetPassword = {
    body: Joi.object().keys({
        password: Joi.string().required().custom(custom_validation_1.password),
        otp: Joi.string().required(),
    }),
};
exports.verifyAccount = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        otp: Joi.string().required(),
    }),
};
