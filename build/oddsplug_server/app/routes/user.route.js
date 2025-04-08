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
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user = __importStar(require("../controllers/user.controller"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const router = (0, express_1.Router)();
router.get("/plans", user.getActivePlans);
router.get("/recommendations", user.getRecommendations);
router.get("/recommendation/:recommendationId", user.getRecommendation);
router.post("/support", express_useragent_1.default.express(), user.submitSupport);
router.use(auth_middleware_1.authenticateUserToken);
router.get("/dashboard", user.dashboardInit);
router.get("/bet-settings", user.betSettingsInit);
router.get("/profile", user.getProfile);
router.get("/bet-histories", user.betHistories);
router.get("/bet-history/:historyId", user.getBetHistory);
router.get("/subscription-histories", user.subscriptionHistories);
router.get("/subscription-history/:historyId", user.getSubscriptionHistory);
router.post("/recommend", user.submitRecommend);
router.post("/recommendation-vote", user.submitRecommendationVote);
router.post("/recommendation-comment", user.submitRecommendationComment);
router.post("/save-bet", user.saveBet);
router.post("/update-password", user.updatePassword);
router.post("/update-profile", user.updateProfile);
router.post("/subscribe", express_useragent_1.default.express(), user.pay4Subscription);
router.post("/bet-settings", user.updateBetSettings);
router.delete("/bet-history/:historyId", user.deleteBetHistory);
// router.get("/profile",courseList);
// router.route('/').get(getUsers).post(createUser);
exports.default = router;
