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
exports.subscribe2Notification = exports.logout = exports.refreshAccessToken = exports.resetPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../utils/helpers");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_detail_service_1 = __importDefault(require("../services/user-detail.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const user_setting_service_1 = __importDefault(require("../services/user-setting.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../utils/config"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const authService = new auth_service_1.default();
        // Check if the user already exists
        const auths = yield authService.getAuth({ email });
        if (auths.length > 0) {
            res.status(400).json({ status: false, message: "User already exists" });
            return;
        }
        // Create a new user using the email and hashed password
        const username = email.split('@')[0] + Math.floor(Math.random() * 100000); //Generate a random username
        const userAgent = (0, helpers_1.createUserAgent)(req);
        const auth = yield authService.createAuth({ email, password: hashedPassword, role: "user", username, devices: [userAgent] });
        const user = { id: auth._id, email: auth.email, role: auth.role, username: auth.username, sec: auth.password };
        const accessToken = (0, helpers_1.generateAccessToken)(user);
        const refreshToken = (0, helpers_1.generateRefreshToken)(user);
        // console.log({auth})
        // console.log({user})
        // Update the JWT in the database
        const updateAuth = yield authService.updateAuth({ email }, { JWT: refreshToken });
        if (!updateAuth) {
            res.status(400).json({ status: false, message: "Failed to update JWT" });
            return;
        }
        // Create a user account
        const userDetailService = new user_detail_service_1.default();
        const authId = new mongoose_1.default.Types.ObjectId(auth._id);
        const userAccount = yield userDetailService.createUserDetail({ authId });
        if (!userAccount) {
            res.status(400).json({ status: false, message: "Failed to create user account" });
            return;
        }
        // Create user settings
        const bookmakers = helpers_1.ourBookmakers.map(b => b.name);
        const sports = helpers_1.ourSports.map(s => s.name);
        const userSettingService = new user_setting_service_1.default();
        const userSettingAccount = yield userSettingService.createUserSetting({ authId, arbitrageAlert: 100, bookmakers, sports, timezone: "Africa/Lagos", oddType: "decimal", clonedBookmakers: [{ parent: "_1xbet", bookmaker: "_1xbet", customURL: "https://ng.1x001.com" }] });
        if (!userSettingAccount) {
            res.status(400).json({ status: false, message: "Failed to create user settings" });
            return;
        }
        const newUser = Object.assign({}, user);
        newUser.authId = newUser.id;
        delete newUser.id;
        delete newUser.sec;
        // Set the refresh token in the cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config_1.default.env !== "development" });
        res.json({ status: true, accessToken, refreshToken, user: newUser });
    }
    catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password } = req.body;
    try {
        const authService = new auth_service_1.default();
        const auths = yield authService.getAuth({ email });
        if (!auths || auths.length == 0) {
            res.status(400).json({ status: false, message: "User does not exist" });
            return;
        }
        if (auths.length > 1) {
            res.status(400).json({ status: false, message: "Multiple users with same email" });
            return;
        }
        const auth = auths[0];
        if (auth.isOAuth) {
            // Because users authenticated via third party OAuth can't login with password
            res.status(400).json({ status: false, message: "User authenticated via third party OAuth" });
            return;
        }
        try {
            if (yield bcryptjs_1.default.compare(password, auth.password)) {
                const user = { id: auth._id, email: auth.email, role: auth.role, username: auth.username, sec: auth.password };
                const accessToken = (0, helpers_1.generateAccessToken)(user);
                const refreshToken = (0, helpers_1.generateRefreshToken)(user);
                // Check for devices
                const userAgent = (0, helpers_1.createUserAgent)(req);
                if ('devices' in auth) {
                    let updated = false;
                    const devices = (_a = auth.devices) === null || _a === void 0 ? void 0 : _a.map(device => {
                        if (device.status == 1) {
                            device.status = 0;
                        }
                        if (device.useragent == userAgent.useragent || device.ip == userAgent.ip) {
                            device.status = 1;
                            device.lastLogin = new Date();
                            updated = true;
                        }
                        return device;
                    });
                    // update the devices or append new one
                    if (updated)
                        auth.devices = devices;
                    else
                        (_b = auth.devices) === null || _b === void 0 ? void 0 : _b.push(userAgent);
                }
                else {
                    auth.devices = [userAgent];
                }
                const updateAuth = yield authService.updateAuth({ email }, { devices: auth.devices });
                const newUser = Object.assign({}, user);
                newUser.authId = newUser.id;
                delete newUser.id;
                delete newUser.sec;
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config_1.default.env !== "development" });
                res.json({ status: true, accessToken, refreshToken, user: newUser });
            }
            else {
                res.json({ status: false, message: 'Invalid credentials' });
            }
        }
        catch (error) {
            logger_1.default.error(`Error logging in: ${error}`);
            res.json({ status: false, message: `Error logging in: ${error.message}` });
        }
    }
    catch (error) {
        logger_1.default.error(`Error logging in: ${error}`);
        res.json({ status: false, message: error.message });
    }
});
exports.login = login;
const resetPasswordFunction = (auth, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (auth.isOAuth) {
        // Because users authenticated via third party OAuth can't reset password
        res.json({ status: false, message: "User authenticated via third party OAuth" });
    }
    try {
        const newPassword = (0, helpers_1.genID)(10);
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        const authService = new auth_service_1.default();
        const updateAuth = yield authService.updateAuth({ _id: auth._id }, { password: hashedPassword });
        if (updateAuth) {
            const subject = "Oddsplug: Password Reset";
            const message = `Dear ${auth.username}, <br/><br/> Your password has been reset to: ${newPassword}<br/>Thanks`;
            let contents = fs_1.default.readFileSync('./app/data/mail.html').toString();
            contents = contents.replace(/==mail-title==/gi, "Password Reset");
            const html = contents.replace(/==mail-body==/gi, message);
            (0, helpers_1.sendMail)({ subject, html, to: auth.email, callback: function (error, info) {
                    if (error) {
                        logger_1.default.error(`Error resetting password: ${error}`);
                        res.json({ status: false, message: 'Password reset successful but mail not sent' });
                    }
                } });
            res.json({ status: true, message: 'New password has been sent to your email address successfully' });
        }
        else {
            res.json({ status: false, message: `Error resetting password` });
        }
    }
    catch (error) {
        logger_1.default.error(`Error resetting password: ${error}`);
        res.json({ status: false, message: `Error resetting password: ${error.message}` });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    try {
        const authService = new auth_service_1.default();
        let auths = yield authService.getAuth({ username: user });
        if (!auths || auths.length == 0) {
            auths = yield authService.getAuth({ email: user });
            if (!auths || auths.length == 0) {
                res.status(400).json({ status: false, message: "User does not exist" });
                return;
            }
            else {
                resetPasswordFunction(auths[0], res);
            }
        }
        else {
            resetPasswordFunction(auths[0], res);
        }
    }
    catch (error) {
        logger_1.default.error(`Error logging in: ${error}`);
        res.json({ status: false, message: error.message });
    }
});
exports.resetPassword = resetPassword;
// Token refresh route
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    // console.log("Access token refreshed",{refreshToken},req.cookies)
    if (!refreshToken)
        return res.status(200).json({ status: false, message: "No refresh token" });
    // console.log({refreshToken})
    // console.log(config.refreshToken)
    jsonwebtoken_1.default.verify(refreshToken, config_1.default.refreshToken, (err, user) => {
        if (err)
            return res.status(200).json({ status: false, message: "Invalid refresh token" });
        // TODO: Randomly check if the JWTtoken and password is the same in the database (check if the device is active, check if refreshToken is same)
        delete user.iat;
        const accessToken = (0, helpers_1.generateAccessToken)(user);
        user.authId = user.id;
        delete user.id;
        delete user.sec;
        res.status(200).json({ status: true, accessToken, user });
    });
});
exports.refreshAccessToken = refreshAccessToken;
// ================= AUTHENTICATED ROUTES ================= 
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const auth = req.auth;
        // Check for devices
        const userAgent = (0, helpers_1.createUserAgent)(req);
        if ('devices' in auth) {
            let updated = false;
            const devices = (_a = auth.devices) === null || _a === void 0 ? void 0 : _a.map(device => {
                // set the status of the device to 0
                if (device.useragent == userAgent.useragent || device.ip == userAgent.ip) {
                    device.status = 0;
                    updated = true;
                }
                return device;
            });
            // update the devices or append new one
            if (updated)
                auth.devices = devices;
            else
                (_b = auth.devices) === null || _b === void 0 ? void 0 : _b.push(userAgent);
        }
        else {
            auth.devices = [userAgent];
        }
        const authService = new auth_service_1.default();
        const updateAuth = yield authService.updateAuth({ _id: auth.id }, { devices: auth.devices, JWT: "" });
        // console.log({updateAuth})
        res.json({ status: true, message: "logged out successfully" });
    }
    catch (error) {
        logger_1.default.error(`Error logging out: ${error}`);
        res.json({ status: false, message: `Error logging in: ${error.message}` });
    }
});
exports.logout = logout;
const subscribe2Notification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const subscription = req.body.subscription;
    const { arbitrageAlert } = req.body;
    try {
        const auth = req.auth;
        const authService = new auth_service_1.default();
        // Check for devices
        const userAgent = (0, helpers_1.createUserAgent)(req);
        if ('devices' in auth) {
            let updated = false;
            const devices = (_a = auth.devices) === null || _a === void 0 ? void 0 : _a.map(device => {
                // update the notification of the device
                if (device.useragent == userAgent.useragent || device.ip == userAgent.ip) {
                    device.notificationSubscription = subscription;
                    updated = true;
                }
                return device;
            });
            // update the devices or append new one
            if (updated)
                auth.devices = devices;
            else
                (_b = auth.devices) === null || _b === void 0 ? void 0 : _b.push(userAgent);
        }
        else {
            userAgent.notificationSubscription = subscription;
            auth.devices = [userAgent];
        }
        const updateAuth = yield authService.updateAuth({ _id: auth.id }, { devices: auth.devices });
        // Update the  user setting
        const userSettingService = new user_setting_service_1.default();
        const updateUserSett = yield userSettingService.updateUserSetting({ authId: auth.id }, { arbitrageAlert: parseFloat(arbitrageAlert) });
        res.status(200).json({ status: true, message: "successfully updated the arbitrage alert" });
    }
    catch (error) {
        logger_1.default.error(`Error saving subscription : ${error}`);
        res.status(201).json({ status: false, message: "Failed to update the arbitrage alert" });
    }
});
exports.subscribe2Notification = subscribe2Notification;
