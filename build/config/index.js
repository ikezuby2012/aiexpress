"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
require("dotenv/config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid("production", "development", "test")
        .required(),
    PORT: joi_1.default.number().default(5007),
    LOCAL_MONGODB_URL: joi_1.default.string().required().description("Mongo DB url"),
    JWT_SECRET: joi_1.default.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.string()
        .default("7d")
        .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number()
        .default(30)
        .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which verify email token expires"),
    JWT_COOKIE_EXPIRES_IN: joi_1.default.number().description("minutes after which cookie tokens expire"),
    TWILIO_ACCOUNT_SID: joi_1.default.string().description("SID number for twilio"),
    TWILIO_AUTH_TOKEN: joi_1.default.string().description("auth token for twilio"),
    TWILIO_PHONENUMBER: joi_1.default.string().description("phone number for twilio"),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.LOCAL_MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        jwtExpiresIn: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        cookieExpiresIn: envVars.JWT_COOKIE_EXPIRES_IN,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        cookieOptions: {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            signed: true,
        },
    },
    twilio: {
        sid: envVars.TWILIO_ACCOUNT_SID,
        AuthToken: envVars.TWILIO_AUTH_TOKEN,
        twilioNumber: envVars.TWILIO_PHONENUMBER,
    },
};
exports.default = config;
