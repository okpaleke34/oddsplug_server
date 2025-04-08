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
exports.subscriptionHistories = exports.getSubscriptionHistory = exports.pay4Subscription = exports.updateBetSettings = exports.updateProfile = exports.updatePassword = exports.getProfile = exports.betSettingsInit = exports.dashboardInit = exports.betHistories = exports.deleteBetHistory = exports.getBetHistory = exports.saveBet = exports.submitRecommendationComment = exports.submitRecommendationVote = exports.submitRecommend = exports.submitSupport = exports.getRecommendation = exports.getRecommendations = exports.getActivePlans = void 0;
const support_service_1 = __importDefault(require("../services/support.service"));
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
const recommendation_service_1 = __importDefault(require("../services/recommendation.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const recommendation_comment_service_1 = __importDefault(require("../services/recommendation-comment.service"));
const user_bet_service_1 = __importDefault(require("../services/user-bet.service"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_detail_service_1 = __importDefault(require("../services/user-detail.service"));
const utility_service_1 = __importDefault(require("../services/utility.service"));
const subscription_service_1 = __importDefault(require("../services/subscription.service"));
const user_setting_service_1 = __importDefault(require("../services/user-setting.service"));
const getActivePlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionService = new subscription_service_1.default();
        const activePlans = yield subscriptionService.getAllActivePlans();
        res.status(200).json({ "status": true, data: activePlans });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.getActivePlans = getActivePlans;
const getRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recommendationService = new recommendation_service_1.default();
        const recommendations = yield recommendationService.getAllRecommendations();
        res.status(200).json({ "status": true, data: recommendations });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.getRecommendations = getRecommendations;
const getRecommendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recommendationId } = req.params;
        const recommendationService = new recommendation_service_1.default();
        const recommendations = yield recommendationService.getRecommendation(recommendationId);
        const recommendationCommentService = new recommendation_comment_service_1.default();
        const comments = yield recommendationCommentService.getRecommendationComments(recommendationId);
        res.status(200).json({ "status": true, data: Object.assign(Object.assign({}, recommendations), { comments }) });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.getRecommendation = getRecommendation;
const submitSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, subject, message } = req.body;
        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        const userAgent = (0, helpers_1.createUserAgent)(req);
        const supportService = new support_service_1.default();
        const createSupport = yield supportService.createSupport({ fullName, email, subject, message, IPAddress: userAgent.ip });
        if (createSupport) {
            res.status(200).json({ "status": true, message: "We have received your message, our support team will process it and get back to you if needed" });
        }
        else {
            res.status(200).json({ "status": false, message: "Error: your message was not sent, try again or use other means of support to reach us out" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.submitSupport = submitSupport;
// ====== Authenticated routes ======
const submitRecommend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { topic, description } = req.body;
        if (!topic || !description) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const recommendationService = new recommendation_service_1.default();
        const createRecommendation = yield recommendationService.createRecommendation({ topic, description, authId });
        if (createRecommendation) {
            res.status(200).json({ "status": true, message: "Recommendation submitted successfully", data: createRecommendation });
        }
        else {
            res.status(200).json({ "status": false, message: "Error: your recommendation was not sent, try again or use other means of support to reach us out" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.submitRecommend = submitRecommend;
const submitRecommendationVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { isUp, id } = req.body;
        if (!id) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const recommendationService = new recommendation_service_1.default();
        const createRecommendation = yield recommendationService.updateRecommendation({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $push: { votes: { authId, isUp, date: new Date() } } });
        if (createRecommendation) {
            res.status(200).json({ "status": true, message: "Recommendation submitted successfully", data: createRecommendation });
        }
        else {
            res.status(200).json({ "status": false, message: "Error: your recommendation was not sent, try again or use other means of support to reach us out" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.submitRecommendationVote = submitRecommendationVote;
const submitRecommendationComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { replyId, message, recommendationId } = req.body;
        if (!message) {
            return res.status(400).json({ status: false, message: "Message field is required" });
        }
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const recommendationCommentService = new recommendation_comment_service_1.default();
        let createRecommendationComment;
        if (replyId) {
            // createRecommendationComment = await recommendationCommentService.updateRecommendationComment({_id:new mongoose.Types.ObjectId(recommendationId)},{$push:{replies:{authId,message,date:new Date()}}})
            createRecommendationComment = yield recommendationCommentService.updateRecommendationComment({ _id: new mongoose_1.default.Types.ObjectId(replyId) }, { $push: { replies: { authId, message, date: new Date(), status: 1 } } });
        }
        else {
            createRecommendationComment = yield recommendationCommentService.createRecommendationComment({ message, authId, recommendationId, status: 1 });
        }
        if (createRecommendationComment) {
            res.status(200).json({ "status": true, message: "Comment submitted successfully", data: createRecommendationComment });
        }
        else {
            res.status(200).json({ "status": false, message: "Error: your comment was not sent, try again or use other means of support to reach us out" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.submitRecommendationComment = submitRecommendationComment;
const saveBet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { betId, betType, calculatorValues, historyLength } = req.body;
        if (!betId) {
            return res.status(400).json({ status: false, message: "Bet ID is required" });
        }
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userBetService = new user_bet_service_1.default();
        const createUserBet = yield userBetService.createUserBet({ authId, betId: new mongoose_1.default.Types.ObjectId(betId), betType, historyLength, calculatorValues });
        if (createUserBet) {
            res.status(200).json({ "status": true, message: "Bet saved successfully", data: createUserBet });
        }
        else {
            res.status(200).json({ "status": false, message: "Error: your bet was not saved, try again or use other means of support to reach us out" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.saveBet = saveBet;
const getBetHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { historyId } = req.params;
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userBetService = new user_bet_service_1.default();
        const userBets = yield userBetService.getBetHistories({ authId, _id: new mongoose_1.default.Types.ObjectId(historyId) }, 1);
        if (userBets.length > 0) {
            let userBet = userBets[0];
            userBet = Object.assign(Object.assign({}, userBet), { matchInfo: Object.assign(Object.assign({}, userBet.matchInfo), userBet.matchInfo.history) });
            delete userBet.matchInfo.history;
            const utilityService = new utility_service_1.default();
            let marketDefinitions = yield utilityService.getUtilityByName(`market_definition_${userBet.matchInfo.sport.toLowerCase()}`.toLowerCase());
            marketDefinitions = marketDefinitions ? marketDefinitions.data : null;
            res.status(200).json({ "status": true, data: userBet, marketDefinitions });
        }
        else {
            res.status(404).json({ "status": false, message: "Bet history not found" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.getBetHistory = getBetHistory;
const deleteBetHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { historyId } = req.params;
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userBetService = new user_bet_service_1.default();
        const userBets = yield userBetService.updateUserBet({ authId, _id: new mongoose_1.default.Types.ObjectId(historyId) }, { status: -1 });
        if (userBets) {
            res.status(200).json({ "status": true, message: "Bet deleted successfully" });
        }
        else {
            res.status(404).json({ "status": false, message: "Bet history not found" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.deleteBetHistory = deleteBetHistory;
const betHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userBetService = new user_bet_service_1.default();
        const userBets = yield userBetService.getBetHistories({ authId, status: 1 }, 20);
        res.status(200).json({ "status": true, data: userBets });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.betHistories = betHistories;
const dashboardInit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userBetService = new user_bet_service_1.default();
        const userBets = yield userBetService.getBetHistories({ authId, status: 1 }, 10);
        const userSettingService = new user_setting_service_1.default();
        const userSettings = yield userSettingService.getUserSetting({ authId });
        let settings = {};
        if (userSettings.length == 1) {
            settings = userSettings[0];
        }
        const subscriptionService = new subscription_service_1.default();
        const subscriptions = yield subscriptionService.getSubscriptionHistories({ authId, status: 1 });
        let subscription = {};
        if (subscriptions.length > 0) {
            subscription = subscriptions[0];
        }
        const userService = new user_detail_service_1.default();
        const users = yield userService.getUserDetail({ authId: authId });
        let profile = {};
        if (users.length == 1) {
            profile = users[0];
        }
        res.status(200).json({ "status": true, data: { recentBets: userBets, settings, subscription, profile } });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.dashboardInit = dashboardInit;
const betSettingsInit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userSettingService = new user_setting_service_1.default();
        const userSettings = yield userSettingService.getUserSetting({ authId });
        let settings = {};
        if (userSettings.length == 1) {
            settings = userSettings[0];
        }
        res.status(200).json({ "status": true, data: { settings, bookmakers: helpers_1.ourBookmakers, sports: helpers_1.ourSports, defClonedBookmakers: helpers_1.cloneBookmakers } });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.betSettingsInit = betSettingsInit;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = req.auth;
        const userService = new user_detail_service_1.default();
        let user = yield userService.getUserDetailProfile({ authId: auth._id });
        user = Object.assign(Object.assign(Object.assign({}, user), user.auth), user.address);
        if (user.devices.length > 0) {
            for (let i = 0; i < user.devices.length; i++) {
                if (user.devices[i].status == 1) {
                    user.device = user.devices[i];
                    break;
                }
            }
        }
        delete user.password;
        delete user.auth;
        delete user.JWT;
        delete user.__v;
        delete user.devices;
        // delete user.createdAt
        delete user.updatedAt;
        delete user.authId;
        delete user._id;
        res.status(200).json({ "status": true, data: user });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.getProfile = getProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const auth = req.auth;
        const authService = new auth_service_1.default();
        const updatePasswordAction = yield authService.changePassword(oldPassword, newPassword, confirmPassword, auth);
        res.status(200).json(updatePasswordAction);
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.updatePassword = updatePassword;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const auth = req.auth;
        // Check if required fields are filled
        if (user.firstName == "" || user.lastName == "" || user.email == "" || user.username == "") {
            return res.status(400).json({ status: false, message: "Fill all required fields" });
        }
        // Check if email is valid
        if (!user.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            return res.status(400).json({ status: false, message: "Invalid email address" });
        }
        // Check if email and username are unique
        const authService = new auth_service_1.default();
        const checkEmail = yield authService.getAuth({ email: user.email });
        if (checkEmail.length > 0 && !auth._id.equals(checkEmail[0]._id)) {
            return res.status(400).json({ status: false, message: "Email already exists" });
        }
        const checkUsername = yield authService.getAuth({ username: user.username });
        if (checkUsername.length > 0 && !auth._id.equals(checkUsername[0]._id)) {
            return res.status(400).json({ status: false, message: "Username already exists" });
        }
        // Update authentication
        const authUser = { id: auth._id, email: user.email, role: auth.role, username: user.username, sec: auth.password };
        const accessToken = (0, helpers_1.generateAccessToken)(authUser);
        const refreshToken = (0, helpers_1.generateRefreshToken)(authUser);
        // Update authentication
        const updateAuth = yield authService.updateAuth({ _id: auth._id }, { email: user.email, username: user.username, dialingCode: user.dialingCode, mobile: user.mobile, JWT: refreshToken });
        if (!updateAuth) {
            return res.status(500).json({ "status": false, message: "Error: Failed to update user" });
        }
        const address = {
            address: user.address,
            apartment: user.apartment,
            city: user.city,
            postalCode: user.postalCode,
            state: user.state,
            country: user.country
        };
        // Update user
        const userService = new user_detail_service_1.default();
        const updateUser = yield userService.updateUserDetail({ authId: auth._id }, { firstName: user.firstName, lastName: user.lastName, address });
        if (!updateUser) {
            return res.status(500).json({ "status": false, message: "Error: Failed to update user" });
        }
        res.status(200).json({ "status": true, message: "Profile updated successfully", accessToken, refreshToken, user: authUser });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.updateProfile = updateProfile;
// updateBetSettings
const updateBetSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const settings = req.body;
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const userSettingService = new user_setting_service_1.default();
        const updateSettings = yield userSettingService.updateUserSetting({ authId }, Object.assign({}, settings));
        if (updateSettings) {
            res.status(200).json({ "status": true, message: "Settings updated successfully", data: updateSettings });
        }
        else {
            res.status(500).json({ "status": false, message: "Failed to update settings" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.updateBetSettings = updateBetSettings;
const pay4Subscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribe = req.body;
        const auth = req.auth;
        const startDate = new Date();
        const endDate = new Date(startDate);
        const userAgent = (0, helpers_1.createUserAgent)(req);
        endDate.setDate(startDate.getDate() + Number(subscribe.plan.durationInDays));
        const newSubscription = { authId: auth._id, planId: new mongoose_1.default.Types.ObjectId(subscribe.plan._id), amount: subscribe.plan.amount, currency: subscribe.plan.currency, startDate, endDate, transactionId: subscribe.transactionId, paymentMethod: subscribe.paymentMethod, paymentDate: startDate, status: subscribe.isSuccessful ? 1 : -2, IPAddress: userAgent.ip, transactionData: subscribe.transactionData };
        const subscriptionService = new subscription_service_1.default();
        const createSubscription = subscriptionService.createSubscription(newSubscription);
        if (createSubscription) {
            return res.status(200).json({ "status": true, message: "Subscription registration successfully", data: createSubscription });
        }
        return res.status(500).json({ "status": false, message: "Failed to register subscription" });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.pay4Subscription = pay4Subscription;
const getSubscriptionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { historyId } = req.params;
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const subscriptionService = new subscription_service_1.default();
        const subscriptions = yield subscriptionService.getSubscriptionHistories({ authId, _id: new mongoose_1.default.Types.ObjectId(historyId) });
        if (subscriptions.length > 0) {
            res.status(200).json({ "status": true, data: subscriptions[0] });
        }
        else {
            res.status(404).json({ "status": false, message: "Subscription history not found" });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.getSubscriptionHistory = getSubscriptionHistory;
const subscriptionHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a._id;
        const subscriptionService = new subscription_service_1.default();
        const subscriptions = yield subscriptionService.getSubscriptionHistories({ authId });
        res.status(200).json({ "status": true, data: subscriptions });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(500).json({ "status": false, message: error.message });
    }
});
exports.subscriptionHistories = subscriptionHistories;
