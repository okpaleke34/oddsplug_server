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
exports.arbitragesPageInfo = exports.deleteExclusionRule = exports.editExclusionRule = exports.runExclusionRule = exports.addExclusionRule = exports.exclusionRulesList = exports.saveMatchedMarketsState = exports.bookmakerMatchedMarket = exports.bookmakerTranslatedMarket = exports.matchedMarketsPage = exports.matchedMarketsList = void 0;
const matched_market_service_1 = __importDefault(require("../services/matched-market.service"));
const arbitrage_service_1 = __importDefault(require("../services/arbitrage.service"));
const helpers_1 = require("../utils/helpers");
const logger_1 = __importDefault(require("../utils/logger"));
const exclusion_rule_service_1 = __importDefault(require("../services/exclusion-rule.service"));
const domain = "https://oddsplug.com";
const apiServer = process.env.NODE_ENV !== 'production' ? 'http://localhost:4001' : "https://api.oddsplug.com";
const matchedMarketsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchedMarketService = new matched_market_service_1.default();
        const matchedMarkets = yield matchedMarketService.getAllMatchedMarket();
        // Only return the bookmaker and sport
        const matchedMarketsItems = matchedMarkets.map((mm) => {
            return { bookmaker: mm.bookmaker, sport: mm.sport };
        });
        res.json({ status: true, data: matchedMarketsItems });
    }
    catch (err) {
        logger_1.default.error(`Error in matchedMarketsList: ${err}`);
        res.status(500).send({ status: false, message: `Error Fetching matched market list: ${err}` });
    }
});
exports.matchedMarketsList = matchedMarketsList;
const matchedMarketsPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sport, bookmaker } = req.params;
        const matchedMarketService = new matched_market_service_1.default();
        const matchedMarket = yield matchedMarketService.getMatchedMarketData({ sport, bookmaker });
        if (matchedMarket.length == 1) {
            let mm = matchedMarket[0];
            const our_market_mock_url = `${apiServer}/data/universal/${mm.ourMarketMock}`;
            const our_market_names_url = `${apiServer}/data/universal/${mm.ourMarketDefinition}`;
            mm = Object.assign(Object.assign({}, mm._doc), { our_market_mock_url, our_market_names_url });
            res.json({ status: true, data: mm });
        }
        else {
            res.json({ status: false, message: "No Matched Market Found" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error Fetching Page Information: ${err}`);
        res.status(500).send({ status: false, message: `Error Fetching Page Information: ${err}` });
    }
});
exports.matchedMarketsPage = matchedMarketsPage;
const bookmakerTranslatedMarket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sport, bookmaker } = req.params;
        const matchedMarketService = new matched_market_service_1.default();
        const matchedMarket = yield matchedMarketService.getMatchedMarketData({ sport, bookmaker });
        if (matchedMarket.length == 1) {
            if (matchedMarket[0].translatedMarkets.length === 0) {
                // Translate the bookmaker market
                const mm = matchedMarket[0];
                const bookmakerMarket = yield Promise.resolve(`${`../data/bookmakers/${mm.bookmakerMarket}`}`).then(s => __importStar(require(s)));
                const translatedBookmakerMarket = (0, helpers_1.translateBookmakerMarket)(mm.bookmaker, bookmakerMarket);
                let saved2DB = false;
                if (translatedBookmakerMarket) {
                    // save to db
                    const updated = yield matchedMarketService.updateMatchedMarket({ sport, bookmaker }, { translatedMarkets: translatedBookmakerMarket });
                    saved2DB = updated ? true : false;
                }
                if (saved2DB) {
                    res.json({ status: true, data: translatedBookmakerMarket });
                }
                else {
                    res.json({ status: false, message: "No Matched Market Found" });
                }
            }
            else {
                // Return the translated market
                res.json({ status: true, data: matchedMarket[0].translatedMarkets });
            }
        }
        else {
            res.json({ status: false, message: "No Matched Market Found" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error in bookmakerTranslatedMarket: ${err}`);
        res.status(500).send({ status: false, message: `Error translating bookmaker market: ${err}` });
    }
});
exports.bookmakerTranslatedMarket = bookmakerTranslatedMarket;
const bookmakerMatchedMarket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sport, bookmaker } = req.params;
        const matchedMarketService = new matched_market_service_1.default();
        const matchedMarket = yield matchedMarketService.getMatchedMarketData({ sport, bookmaker });
        if (matchedMarket.length > 0) {
            res.json({ status: true, data: matchedMarket[0].matchedMarkets });
        }
        else {
            res.json({ status: false, message: "No Matched Market Found" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error in bookmakerMatchedMarket: ${err}`);
        res.status(500).send({ status: false, message: `Error Fetching Bookmaker Matched Market: ${err}` });
    }
});
exports.bookmakerMatchedMarket = bookmakerMatchedMarket;
const saveMatchedMarketsState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sport, bookmaker, matchedMarket, bookmakerMarket } = req.body;
        const matchedMarketService = new matched_market_service_1.default();
        const updatedMatchedMarket = yield matchedMarketService.updateMatchedMarket({ sport, bookmaker }, { matchedMarkets: matchedMarket, translatedMarkets: bookmakerMarket });
        if (updatedMatchedMarket) {
            res.json({ status: true, message: "Matched Markets State Saved" });
        }
        else {
            res.json({ status: false, message: "No Matched Market Found" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error in saveMatchedMarketsState: ${err}`);
        res.status(500).send({ status: false, message: `Error Saving matched market state: ${err}` });
    }
});
exports.saveMatchedMarketsState = saveMatchedMarketsState;
const applyExclusionRule = (rules) => __awaiter(void 0, void 0, void 0, function* () {
    const arbitrageService = new arbitrage_service_1.default();
    const activeArbitrages = yield arbitrageService.getActiveArbitrages({ status: 1 });
    const { validArbitrages, rejectedArbitrages, rejectedArbitragesIds } = (0, helpers_1.filterArbList)(activeArbitrages, rules);
    const condition = { _id: { $in: rejectedArbitragesIds } };
    const newValueUpdate = { status: 2 };
    const updatedArbitragesCount = yield arbitrageService.updateManyArbitrage(condition, newValueUpdate);
    if (updatedArbitragesCount || updatedArbitragesCount == 0) {
        return { status: true, message: "Exclusion applied successful", updatedArbitragesCount };
    }
    else {
        return { status: false, message: "Failed to apply exclusion rule" };
    }
});
const exclusionRulesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exclusionRuleService = new exclusion_rule_service_1.default();
        let exclusionRules = yield exclusionRuleService.getAllExclusionRule();
        // Sort by status
        exclusionRules = exclusionRules.sort((a, b) => {
            if (a.status === b.status) {
                return 0;
            }
            return a.status === 1 ? -1 : 1;
        });
        res.json({ status: true, data: exclusionRules });
    }
    catch (err) {
        logger_1.default.error(`Error in exclusionRulesList: ${err}`);
        res.status(500).send({ status: false, message: `Error Fetching Exclusion Rules: ${err}` });
    }
});
exports.exclusionRulesList = exclusionRulesList;
const addExclusionRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, rule, status } = req.body;
        const adminId = "124323";
        // rule = {
        //   scanId: "any",
        //   marketCode: "p_highest_score_quarter",
        //   bookmaker: "any",
        //   sport: "Basketball",
        //   matchId: "Gmunden_Klosterneuburg_1743953400",
        //   gameType: "any",
        //   arbId: "any",
        // }
        // If status is not provided, set it to 0 which means the rule will apply once and not be running for the next arbitrages
        // if(!status){
        //   status = 0
        // }
        const rules = [rule];
        const applyResult = yield applyExclusionRule(rules);
        if (applyResult.status) {
            // Save the exclusion rule to the database
            const exclusionRuleService = new exclusion_rule_service_1.default();
            // const exclusionRule = await exclusionRuleService.createExclusionRule({name:"New Rule",adminId,rule:newRule,status:1});
            const exclusionRule = yield exclusionRuleService.createExclusionRule({ name, adminId, rule, status });
            if (exclusionRule) {
                res.json({ status: true, message: `Exclusion Rule Created, new rule was applied in ${applyResult.updatedArbitragesCount} arbitrages` });
            }
            else {
                res.json({ status: false, message: `Exclusion Rule Not Created but new rule was applied in ${applyResult.updatedArbitragesCount} arbitrages` });
            }
        }
        else {
            res.json({ status: false, message: `Exclusion rule was not created and new rule was not applied` });
        }
    }
    catch (err) {
        logger_1.default.error(`Error in addExclusionRule: ${err}`);
        res.status(500).send({ status: false, message: `Error saving exclusion rule: ${err}` });
    }
});
exports.addExclusionRule = addExclusionRule;
const runExclusionRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rule } = req.body;
        const rules = [rule];
        const applyResult = yield applyExclusionRule(rules);
        if (applyResult.status) {
            res.json({ status: true, message: `Exclusion Rule was applied in ${applyResult.updatedArbitragesCount} arbitrages` });
        }
        else {
            res.json(applyResult);
        }
    }
    catch (err) {
        logger_1.default.error(`Error in runExclusionRule: ${err}`);
        res.status(500).send({ status: false, message: `Error in applying exclusion rule: ${err}` });
    }
});
exports.runExclusionRule = runExclusionRule;
const editExclusionRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, rule, status, id } = req.body;
        const adminId = "124323";
        // // If status is not provided, set it to 0 which means the rule will apply once and not be running for the next arbitrages
        // if(!status){
        //   status = 0
        // }
        // Save the exclusion rule to the database
        const exclusionRuleService = new exclusion_rule_service_1.default();
        const updatedExclusionRule = yield exclusionRuleService.updateExclusionRule({ _id: id }, { name, adminId, rule, status });
        if (updatedExclusionRule) {
            res.json({ status: true, message: "Exclusion rule updated successfully" });
        }
        else {
            res.json({ status: false, message: "Failed to update Exclusion rule" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error in editExclusionRule: ${err}`);
        res.status(500).send({ status: false, message: `Error updating exclusion rule: ${err}` });
    }
});
exports.editExclusionRule = editExclusionRule;
const deleteExclusionRule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ruleId } = req.params;
        // Delete exclusion rule from the database
        const exclusionRuleService = new exclusion_rule_service_1.default();
        const deleteExclusionRuleResult = yield exclusionRuleService.deleteExclusionRule(ruleId);
        if (deleteExclusionRuleResult) {
            res.json({ status: true, message: "Exclusion rule deleted successfully" });
        }
        else {
            res.json({ status: false, message: "Failed to delete exclusion rule" });
        }
    }
    catch (err) {
        logger_1.default.error(`Error in deleteExclusionRule: ${err}`);
        res.status(500).send({ status: false, message: `Error deleting exclusion rule: ${err}` });
    }
});
exports.deleteExclusionRule = deleteExclusionRule;
const arbitragesPageInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const arbitrageService = new arbitrage_service_1.default();
        const aggregate = [
            {
                $match: { status: 1 }
            },
            {
                $group: {
                    _id: { sport: "$sport", gameType: "$gameType" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.sport",
                    stats: {
                        $push: {
                            k: "$_id.gameType",
                            v: "$count"
                        }
                    }
                }
            },
            {
                $project: {
                    prematch: {
                        $let: {
                            vars: {
                                p: {
                                    $first: {
                                        $filter: {
                                            input: "$stats",
                                            as: "s",
                                            cond: { $eq: ["$$s.k", "prematch"] }
                                        }
                                    }
                                }
                            },
                            in: { $ifNull: ["$$p.v", 0] }
                        }
                    },
                    live: {
                        $let: {
                            vars: {
                                l: {
                                    $first: {
                                        $filter: {
                                            input: "$stats",
                                            as: "s",
                                            cond: { $eq: ["$$s.k", "live"] }
                                        }
                                    }
                                }
                            },
                            in: { $ifNull: ["$$l.v", 0] }
                        }
                    },
                    sport: "$_id",
                    _id: 0
                }
            }
        ];
        const arbitrageStats = yield arbitrageService.getAggregate(aggregate);
        arbitrageStats.sort((a, b) => a.sport.localeCompare(b.sport)); //Sort by sport name
        res.json({ status: true, message: "Failed to delete exclusion rule", data: { arbitrageStats } });
    }
    catch (err) {
        logger_1.default.error(`Error in arbitragesPageInfo: ${err}`);
        res.status(500).send({ status: false, message: `Error fetching data: ${err}` });
    }
});
exports.arbitragesPageInfo = arbitragesPageInfo;
