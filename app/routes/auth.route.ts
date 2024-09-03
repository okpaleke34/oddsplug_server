import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { authenticateUserToken } from '../middlewares/auth.middleware';
import useragent from "express-useragent";

const router = Router();

// router.get("/profile",courseList);
// router.route('/').get(getUsers).post(createUser);
router.post("/register",useragent.express(),auth.register);
router.post("/login",useragent.express(),auth.login);
router.post("/refresh-token",auth.refreshAccessToken);
router.post("/reset-password",auth.resetPassword);
router.get("/send-notification",auth.sendNotification);
router.use(authenticateUserToken);
router.post("/notification-subscribe",useragent.express(),auth.subscribe2Notification);
router.post("/logout",useragent.express(),auth.logout);


export default router;