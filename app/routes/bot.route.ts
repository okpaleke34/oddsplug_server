import { Router } from 'express';
import { botAuth } from '../middlewares/auth.middleware';

import * as bot from '../controllers/bot.controller';
const router = Router();

// router.get("/profile",courseList);
// router.route('/').get(getUsers).post(createUser);
router.use(botAuth)

// Authenticated for bots
// router.post("/fetch-bot-arbitrages",bot.fetchBotArbitrages);
router.post("/post-arbitrage",bot.postArbitrage);
// router.post("/update-arbitrage",bot.updateArbitrage);
router.post("/remove-arbitrages",bot.removeArbitrage);

export default router;