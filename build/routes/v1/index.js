"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_route_1 = __importDefault(require("./swagger.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
// import config from "../../config";
const router = express_1.default.Router();
const defaultIRoute = [
    // documentation
    {
        path: "/docs",
        route: swagger_route_1.default,
    },
    {
        path: "/auth",
        route: auth_route_1.default,
    },
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: "/docs",
        route: swagger_route_1.default,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
    devIRoute.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;
