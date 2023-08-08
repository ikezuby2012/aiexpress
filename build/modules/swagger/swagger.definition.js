"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "zitrobot api",
        version: "0.0.1",
        description: "This is an api for the zitrobot application",
        license: {
            name: "MIT",
            url: "https://github.com/mremphraim/zitrobot-api.git",
        },
    },
    servers: [
        {
            url: "http://localhost:5000/api/v1",
            description: `${config_1.default.env} server`,
        },
        {
            url: "https://zitrobot-api.onrender.com/api/v1",
            description: `production server`,
        },
    ],
};
exports.default = swaggerDefinition;
