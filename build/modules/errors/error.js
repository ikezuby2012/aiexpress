"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
// import config from "../../config";
const logger_1 = require("../logger");
const ApiError_1 = __importDefault(require("./ApiError"));
const handleCastErrorDB = (err) => {
    const message = `invalid ${err.path}: ${err.value}`;
    return new ApiError_1.default(http_status_1.default.NOT_FOUND, message);
};
const handleDuplicateErrorDB = (err) => {
    console.log(err);
    const message = `${err.keyValue.email} has already been used!. please use another value`;
    return new ApiError_1.default(http_status_1.default.NOT_FOUND, message);
};
const handleJWTError = () => new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "invalid token please login again");
const handleTokenExpiredError = () => new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "token has expired");
const errorConverter = (err, _req, _res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    if (error.name === "CastError")
        error = handleCastErrorDB(error);
    if (error.code === 11000)
        error = handleDuplicateErrorDB(error);
    if (error.name === "JsonWebTokenError")
        error = handleJWTError();
    if (error.name === "TokenExpiredError")
        error = handleTokenExpiredError();
    if (!(error instanceof ApiError_1.default)) {
        const statusCode = error.statusCode || error instanceof mongoose_1.default.Error
            ? http_status_1.default.BAD_REQUEST
            : http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || `${http_status_1.default[statusCode]}`;
        error = new ApiError_1.default(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    var _a;
    let { statusCode, message } = err;
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = "Internal Server Error";
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ code: statusCode, message }, (process.env.NODE_ENV === "development" &&
        ((_a = _req.get("host")) === null || _a === void 0 ? void 0 : _a.startsWith("localhost")) && {
        stack: err.stack,
    }));
    if (process.env.NODE_ENV === "development") {
        logger_1.logger.error(err);
    }
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
