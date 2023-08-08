import Joi from "joi";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(5007),
    LOCAL_MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string()
      .default("7d")
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    JWT_COOKIE_EXPIRES_IN: Joi.number().description(
      "minutes after which cookie tokens expire"
    ),
    TWILIO_ACCOUNT_SID: Joi.string().description("SID number for twilio"),
    TWILIO_AUTH_TOKEN: Joi.string().description("auth token for twilio"),
    TWILIO_PHONENUMBER: Joi.string().description("phone number for twilio"),
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
    url:
      envVars.LOCAL_MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
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
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
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

export default config;
