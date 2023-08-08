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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const user_1 = require("../user");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
// import { verifyToken } from "../token/token.service";
const { secret } = config_1.default.jwt;
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new ApiError_1.default(401, "You are not logged in! Please log in to get access."));
    }
    // 2) Verification token
    const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, secret);
    // 3) Check if user still exists
    const currentUser = yield user_1.User.findById(decoded.id);
    if (!currentUser) {
        return next(new ApiError_1.default(401, "The user belonging to this token does no longer exist."));
    }
    // 4) Check if user changed password after the token was issued
    if (yield currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new ApiError_1.default(401, "User recently changed password! Please log in again."));
    }
    // 5) check is user is verified
    if (!currentUser.isAccountVerified) {
        return next(new ApiError_1.default(401, "User is not yet verified, please verify account."));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
}));
// export const restrictRoles = (...role) => {
// }
