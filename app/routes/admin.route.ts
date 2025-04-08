import { fetchArbitrages } from './../../../server_boostrap/app/controllers/bet.controller';
import { Router } from 'express';
import * as admin from '../controllers/admin.controller';
import * as engine from '../controllers/engine.controller';
const router = Router();

 
// router.use(adminAuthCheck)
// router.use(adminAuth)
router.get("/matched-markets-list",admin.matchedMarketsList);
router.get("/matched-markets-page/:bookmaker/:sport",admin.matchedMarketsPage);
router.get("/bookmaker-translated-market/:bookmaker/:sport",admin.bookmakerTranslatedMarket);
router.get("/matched-market/:bookmaker/:sport",admin.bookmakerMatchedMarket);
router.post("/save-matched-markets-state",admin.saveMatchedMarketsState);
router.get("/exclusion-rule-list",admin.exclusionRulesList);
router.post("/add-exclusion-rule",admin.addExclusionRule);
router.post("/run-exclusion-rule",admin.runExclusionRule);
router.put("/edit-exclusion-rule",admin.editExclusionRule);
router.delete("/delete-exclusion-rule/:ruleId",admin.deleteExclusionRule);
router.get("/arbitrages-page-info",admin.arbitragesPageInfo);




// routes based on engine > oddsplug_system db
router.post("/system/scan-histories",engine.systemScanHistories);
router.get("/system/scan-history/:scanId",engine.systemScanHistory);
router.post("/system/revalidate-histories",engine.systemRevalidateHistories);
router.get("/system/revalidate-history/:scanId",engine.systemRevalidateHistory);
router.get("/system/servers",engine.systemServers);

export default router;