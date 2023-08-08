import { password } from "../validate/custom.validation";
import { NewRegisteredUser } from "../user/user.interfaces";

const Joi = require("joi");

const registerBody: Record<keyof NewRegisteredUser, any> = {
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    otp: Joi.string().required(),
  }),
};

export const verifyAccount = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};
