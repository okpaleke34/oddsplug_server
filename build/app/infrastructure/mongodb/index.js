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
exports.MongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_detail_repository_1 = require("./repositories/user-detail.repository");
const support_repository_1 = require("./repositories/support.repository");
const user_setting_repository_1 = require("./repositories/user-setting.repository");
const admin_repository_1 = require("./repositories/admin.repository");
const auth_repository_1 = require("./repositories/auth.repository");
const plan_repository_1 = require("./repositories/plan.repository");
const recommendation_repository_1 = require("./repositories/recommendation.repository");
const recommendation_comment_repository_1 = require("./repositories/recommendation-comment.repository");
const user_bet_repository_1 = require("./repositories/user-bet.repository");
const matched_market_repository_1 = require("./repositories/matched-market.repository");
const exclusion_rule_repository_1 = require("./repositories/exclusion-rule.repository");
const subscription_repository_1 = require("./repositories/subscription.repository");
const utility_repository_1 = require("./repositories/utility.repository");
const arbitrage_repository_1 = require("./repositories/arbitrage.repository");
const config_1 = __importDefault(require("../../utils/config"));
class MongoDB {
    constructor() {
        this.userDetail = new user_detail_repository_1.UserDetailRepository();
        this.support = new support_repository_1.SupportRepository();
        this.subscription = new subscription_repository_1.SubscriptionRepository();
        this.userBet = new user_bet_repository_1.UserBetRepository();
        this.userSetting = new user_setting_repository_1.UserSettingRepository();
        this.matchedMarket = new matched_market_repository_1.MatchedMarketRepository();
        this.exclusionRule = new exclusion_rule_repository_1.ExclusionRuleRepository();
        this.admins = new admin_repository_1.AdminRepository();
        this.auth = new auth_repository_1.AuthRepository();
        this.plan = new plan_repository_1.PlanRepository();
        this.recommendation = new recommendation_repository_1.RecommendationRepository();
        this.recommendationComment = new recommendation_comment_repository_1.RecommendationCommentRepository();
        this.utility = new utility_repository_1.UtilityRepository();
        this.arbitrage = new arbitrage_repository_1.ArbitrageRepository();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(config_1.default.db.connectionString, {
            //   useNewUrlParser: true,
            //   useUnifiedTopology: true,
            });
            console.log('MongoDB connected!');
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.disconnect();
        });
    }
}
exports.MongoDB = MongoDB;
