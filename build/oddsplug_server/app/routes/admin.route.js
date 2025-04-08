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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin = __importStar(require("../controllers/admin.controller"));
const engine = __importStar(require("../controllers/engine.controller"));
const router = (0, express_1.Router)();
// router.use(adminAuthCheck)
// router.use(adminAuth)
router.get("/matched-markets-list", admin.matchedMarketsList);
router.get("/matched-markets-page/:bookmaker/:sport", admin.matchedMarketsPage);
router.get("/bookmaker-translated-market/:bookmaker/:sport", admin.bookmakerTranslatedMarket);
router.get("/matched-market/:bookmaker/:sport", admin.bookmakerMatchedMarket);
router.post("/save-matched-markets-state", admin.saveMatchedMarketsState);
router.get("/exclusion-rule-list", admin.exclusionRulesList);
router.post("/add-exclusion-rule", admin.addExclusionRule);
router.post("/run-exclusion-rule", admin.runExclusionRule);
router.put("/edit-exclusion-rule", admin.editExclusionRule);
router.delete("/delete-exclusion-rule/:ruleId", admin.deleteExclusionRule);
router.get("/arbitrages-page-info", admin.arbitragesPageInfo);
// routes based on engine > oddsplug_system db
router.post("/system/scan-histories", engine.systemScanHistories);
router.get("/system/scan-history/:scanId", engine.systemScanHistory);
router.post("/system/revalidate-histories", engine.systemRevalidateHistories);
router.get("/system/revalidate-history/:scanId", engine.systemRevalidateHistory);
router.get("/system/servers", engine.systemServers);
exports.default = router;
