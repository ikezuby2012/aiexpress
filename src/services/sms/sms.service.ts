import config from "../../config";

const { sid, AuthToken, twilioNumber } = config.twilio;
const accountSid = sid;
const authToken = AuthToken;

const client = require("twilio")(accountSid, authToken);

export const sendOtpSms = (otp, phoneNumber) => {
  client.messages
    .create({
      body: `aiexpress verification code --- ${otp}`,
      to: phoneNumber, // Text your number
      from: twilioNumber, // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
};

export const sendPasswordResetSms = (otp, phoneNumber) => {
  client.messages
    .create({
      body: `aiexpress password reset code --- ${otp}`,
      to: phoneNumber, // Text your number
      from: twilioNumber, // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
};
