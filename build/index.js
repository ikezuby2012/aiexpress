"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./modules/logger/logger"));
dotenv_1.default.config({ path: "../.env" });
const port = config_1.default.port || 5007;
const MONGODB_URL = config_1.default.mongoose.url;
const server = app_1.default.listen(port, () => {
    logger_1.default.info(`Listening to port ${port}`);
});
mongoose_1.default.connect(MONGODB_URL).then(() => {
    logger_1.default.info("Connected to MongoDB");
});
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger_1.default.info("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
    logger_1.default.info("SIGTERM received");
    if (server) {
        server.close();
    }
});
