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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth = __importStar(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_useragent_1 = __importDefault(require("express-useragent"));
const router = (0, express_1.Router)();
// router.get("/profile",courseList);
// router.route('/').get(getUsers).post(createUser);
router.post("/register", express_useragent_1.default.express(), auth.register);
router.post("/login", express_useragent_1.default.express(), auth.login);
router.post("/refresh-token", auth.refreshAccessToken);
router.post("/reset-password", auth.resetPassword);
router.get("/send-notification", auth.sendNotification);
router.use(auth_middleware_1.authenticateUserToken);
router.post("/notification-subscribe", express_useragent_1.default.express(), auth.subscribe2Notification);
router.post("/logout", express_useragent_1.default.express(), auth.logout);
exports.default = router;
