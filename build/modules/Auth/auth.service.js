"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regenerateNewOtp = exports.verifyUserAccount = exports.forgetPasswordServ = exports.loginUserWithNameAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const user_service_1 = require("../user/user.service");
const user_1 = require("../user");
const otp_service_1 = require("../../services/otp/otp.service");
/**
 * Login with username and password
 * @param {string} name
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
const loginUserWithNameAndPassword = (name, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || !password) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Please provide name and password!");
    }
    // 2) Check if user exists && password is correct
    const user = yield user_1.User.findOne({ name }).select("+password");
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect name or password");
    }
    return user;
});
exports.loginUserWithNameAndPassword = loginUserWithNameAndPassword;
/**
 * Forgotten password
 * @param {string} email
 * @returns {Promise<IUserDoc>}
 */
const forgetPasswordServ = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserByName)(name);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "There is no user with this user name.");
    }
    // 2) Generate the random reset token
    const resetToken = yield user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    const returnValue = {
        user,
        token: resetToken,
    };
    return returnValue;
});
exports.forgetPasswordServ = forgetPasswordServ;
/**
 * Verify email
 * @param {mongoose.Types.ObjectId} id
 * @param {string} otp
 * @returns {Promise<IUserDoc | null>}
 */
const verifyUserAccount = (id, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = (0, otp_service_1.verifyOtp)(otp);
    if (!verify) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "otp has expired!, request for a new OTP");
    }
    const user = (yield (0, user_service_1.getUserById)(id));
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "USER NOT FOUND");
    if (user && user.otp !== otp) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "INVALID OTP");
    }
    const updatedUser = yield user_1.User.findByIdAndUpdate(user.id, {
        isAccountVerified: true,
        otp: null,
    }, { new: true });
    return updatedUser;
});
exports.verifyUserAccount = verifyUserAccount;
/**
 * regenerate otp
 * @param {mongoose.Types.ObjectId | string} id
 * @param {string} otp
 * @returns {Promise<IUserDoc>}
 */
const regenerateNewOtp = (id, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_1.User.findByIdAndUpdate(id, { otp }, { new: true });
    return updatedUser;
});
exports.regenerateNewOtp = regenerateNewOtp;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
// export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
//   try {
//     const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
//     const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
//     if (!user) {
//       throw new Error();
//     }
//     await refreshTokenDoc.remove();
//     const tokens = await generateAuthTokens(user);
//     return { user, tokens };
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
// export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
//   try {
//     const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
//     const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
//     if (!user) {
//       throw new Error();
//     }
//     await updateUserById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
//   }
// };
