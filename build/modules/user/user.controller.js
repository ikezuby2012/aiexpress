"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const pick_1 = __importDefault(require("../utils/pick"));
const userService = __importStar(require("./user.service"));
exports.createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(http_status_1.default.NOT_FOUND)
        .send("pls use the /auth/signup route instead");
}));
exports.getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, ["name", "role"]);
    const options = (0, pick_1.default)(req.query, [
        "sortBy",
        "limit",
        "page",
        "projectBy",
    ]);
    const result = yield userService.queryUsers(filter, options);
    res.status(http_status_1.default.OK).json({
        status: "success",
        data: result,
    });
}));
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params.userId === "string") {
        const user = yield userService.getUserById(new mongoose_1.default.Types.ObjectId(req.params.userId));
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        res.status(http_status_1.default.OK).json({
            status: "success",
            data: user,
        });
    }
}));
exports.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params.userId === "string") {
        const user = yield userService.updateUserById(new mongoose_1.default.Types.ObjectId(req.params.userId), req.body);
        res.status(http_status_1.default.OK).json({
            status: "success",
            data: user,
        });
    }
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params.userId === "string") {
        yield userService.deleteUserById(new mongoose_1.default.Types.ObjectId(req.params.userId));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
