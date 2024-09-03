import { Router } from 'express';
import useragent from "express-useragent";
// import * as bet from '../controllers/bet.controller';
import * as bet from '../controllers/bet.controller';
const router = Router();
// router.get("/fetch-arbitrages",bet.fetchArbitrages);


router.post("/fetch-arbitrages",bet.fetchArbitrages);

export default router;