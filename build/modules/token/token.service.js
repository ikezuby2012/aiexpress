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
exports.createSendToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../logger");
const { secret, jwtExpiresIn } = config_1.default.jwt;
// const verify = promisify(jwt.verify);
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id, iat: new Date().getTime() / 1000 }, secret, {
        expiresIn: jwtExpiresIn,
    });
};
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-redeclare
    let returnValue;
    try {
        returnValue = jsonwebtoken_1.default.verify(token, secret);
    }
    catch (err) {
        logger_1.logger.error(err);
        returnValue = {};
    }
    console.log(returnValue, ": return value");
    return returnValue;
});
exports.verifyToken = verifyToken;
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    // Remove password from output
    // eslint-disable-next-line no-param-reassign
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        user,
    });
};
exports.createSendToken = createSendToken;
