import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils";
import { User } from "../user";

import { generateOtp } from "../../services/otp/otp.service";
import { createSendToken } from "../token/token.service";
import * as authService from "./auth.service";
import { logger } from "../logger";

import { IUserDoc } from "../user/user.interfaces";
import { ApiError } from "../errors";
import {
  sendOtpSms,
  sendPasswordResetSms,
} from "../../services/sms/sms.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const otp = generateOtp();

  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    otp,
  });

  // sent otp to user phone number
  try {
    sendOtpSms(otp, req.body.phoneNumber);
  } catch (err: any) {
    logger.error(`${err.message}`, "sms could not be sent");
  }

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { name, password } = req.body;
  const user = await authService.loginUserWithNameAndPassword(name, password);

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { id, otp } = req.body;
  const user = await authService.verifyUserAccount(id, otp);

  res.status(httpStatus.ACCEPTED).json({
    status: "success",
    data: user,
  });
});

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const regenerateOtp = catchAsync(async (req: Request, res: Response) => {
  const otp = generateOtp();
  const { id } = req.params;

  const user = (await authService.regenerateNewOtp(id, otp)) as IUserDoc;

  // send otp to user
  try {
    sendOtpSms(otp, user.phoneNumber);
  } catch (err: any) {
    logger.error(`${err.message}`, "sms could not be sent");
  }

  res.status(httpStatus.OK).json({
    status: "success",
    otp,
    data: user,
  });
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (!user) {
      return next(new ApiError(404, "There is no user with phone number."));
    }

    // 2) Generate the random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // console.log(resetToken, ": reset token");

    // send it to user phone number
    try {
      sendPasswordResetSms(resetToken, req.body.phoneNumber);

      res.status(200).json({
        status: "success",
        message: "Token sent to phone number!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "There was an error sending the sms. Try again later"
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the otp
    const { otp } = req.body;
    const token = otp;
    // get user based on reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(
        new ApiError(httpStatus.NOT_FOUND, "Token is invalid or has expired")
      );
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
  }
);
