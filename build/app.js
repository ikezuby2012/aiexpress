"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = __importDefault(require("./config"));
const logger_1 = require("./modules/logger");
const utils_1 = require("./modules/utils");
const errors_1 = require("./modules/errors");
const v1_1 = __importDefault(require("./routes/v1"));
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== "test") {
    app.use(logger_1.morgan.successHandler);
    app.use(logger_1.morgan.errorHandler);
}
// set security HTTP headers
app.use((0, helmet_1.default)());
// enable cors
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// sanitize request data
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// gzip compression
app.use((0, compression_1.default)());
app.use((0, express_session_1.default)({
    secret: config_1.default.jwt.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));
// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV !== "development") {
    app.use("/api/v1/auth", utils_1.authLimiter);
}
// v1 api routes
app.use("/api/v1", v1_1.default);
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ message: `ping me, server is running on port ${config_1.default.port}` });
});
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new errors_1.ApiError(http_status_1.default.NOT_FOUND, "Request Endpoint Not found"));
});
// convert error to ApiError, if needed
app.use(errors_1.errorConverter);
// handle error
app.use(errors_1.errorHandler);
exports.default = app;
