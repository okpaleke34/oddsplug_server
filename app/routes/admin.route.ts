import { Router } from 'express';
import { getAdmins, createAdmin } from '../controllers/admin.controller';

import * as admin from '../controllers/admin.controller';
const router = Router();

// router.get("/profile",courseList);
// router.route('/').get(getUsers).post(createUser);
router.get("/admins",admin.getAdmins);


router.get("/matched-market-json/:bookmaker/:sport",admin.bookmakerMatchedMarketJSON);
// router.use(adminAuthCheck)

// router.use(adminAuth)
router.get("/matched-markets-list",admin.matchedMarketsList);
router.get("/matched-markets-page/:bookmaker/:sport",admin.matchedMarketsPage);
router.get("/bookmaker-translated-market/:bookmaker/:sport",admin.bookmakerTranslatedMarket);
router.get("/matched-market/:bookmaker/:sport",admin.bookmakerMatchedMarket);
router.post("/save-matched-markets-state",admin.saveMatchedMarketsState);

export default router;