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
exports.deleteUserById = exports.updateUserById = exports.getUserByName = exports.getUserById = exports.queryUsers = exports.registerUser = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("./user.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
const createUser = (userBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_model_1.default.isNameTaken(userBody.name)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already taken");
    }
    return user_model_1.default.create(userBody);
});
exports.createUser = createUser;
/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
const registerUser = (userBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_model_1.default.isNameTaken(userBody.name)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Name already taken");
    }
    return user_model_1.default.create(userBody);
});
exports.registerUser = registerUser;
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.paginate(filter, options);
    return users;
});
exports.queryUsers = queryUsers;
/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () { return user_model_1.default.findById(id); });
exports.getUserById = getUserById;
/**
 * Get user by name
 * @param {string} name;
 * @returns {Promise<IUserDoc | null>}
 */
const getUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () { return user_model_1.default.findOne({ name }); });
exports.getUserByName = getUserByName;
/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
const updateUserById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (updateBody.name && (yield user_model_1.default.isNameTaken(updateBody.name, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Name already taken");
    }
    Object.assign(user, updateBody);
    yield user.save();
    return user;
});
exports.updateUserById = updateUserById;
/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
exports.deleteUserById = deleteUserById;
