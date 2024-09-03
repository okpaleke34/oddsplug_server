import { Router } from 'express';
import { authenticateUserToken } from '../middlewares/auth.middleware';
import * as user from '../controllers/user.controller';
import useragent from "express-useragent";

const router = Router();

router.get("/plans",user.getActivePlans);
router.get("/recommendations",user.getRecommendations);
router.get("/recommendation/:recommendationId",user.getRecommendation);

router.post("/support",useragent.express(),user.submitSupport);

router.use(authenticateUserToken);

router.get("/dashboard",user.dashboardInit);
router.get("/bet-settings",user.betSettingsInit);
router.get("/profile",user.getProfile);
router.get("/bet-histories",user.betHistories);
router.get("/bet-history/:historyId",user.getBetHistory);
router.get("/subscription-histories",user.subscriptionHistories);
router.get("/subscription-history/:historyId",user.getSubscriptionHistory);

router.post("/recommend",user.submitRecommend);
router.post("/recommendation-vote",user.submitRecommendationVote);
router.post("/recommendation-comment",user.submitRecommendationComment);
router.post("/save-bet",user.saveBet);
router.post("/update-password",user.updatePassword);
router.post("/update-profile",user.updateProfile);
router.post("/subscribe",useragent.express(),user.pay4Subscription);
router.post("/bet-settings",user.updateBetSettings);

router.delete("/bet-history/:historyId",user.deleteBetHistory);

// router.get("/profile",courseList);
// router.route('/').get(getUsers).post(createUser);

export default router;