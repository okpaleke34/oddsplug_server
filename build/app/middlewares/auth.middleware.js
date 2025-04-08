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
exports.authenticateUserToken = exports.botAuth = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import dotenv from 'dotenv';
// import Auth from '../models/authModel';
// dotenv.config();
const auth_service_1 = __importDefault(require("../services/auth.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const config_1 = __importDefault(require("../utils/config"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   let token;
    //   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     try {
    //       token = req.headers.authorization.split(' ')[1];
    //       const decoded: any = jwt.verify(token, config.jwt);
    //       req.user = await Auth.findById(decoded.id).select('-password');
    //       next();
    //     } catch (error) {
    //       res.status(401).json({ message: 'Not authorized, token failed' });
    //     }
    //   }
    //   if (!token) {
    //     res.status(401).json({ message: 'Not authorized, no token' });
    //   }
});
exports.protect = protect;
// export const botAuth = (req: Request,res: Response, next: NextFunction) =>{
const botAuth = (req, res, next) => {
    const { robot } = req.cookies;
    if (robot == "2+Aq0fr=^1GT*9B{=C£QXt-9wJm|NGY$j2") {
        res.locals.bot = true;
        next();
    }
    else {
        res.status(404).json({ message: "Not authenticated" });
    }
};
exports.botAuth = botAuth;
const authenticateUserToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, config_1.default.accessToken, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // console.log({err})
            if (err.name == "TokenExpiredError")
                return res.status(403).json({ status: false, message: "Token Expired, Log in again" });
            else
                return res.status(403).json({ status: false, message: err.message });
        }
        const { email, id } = user.user;
        try {
            const authService = new auth_service_1.default();
            const auths = yield authService.getAuth({ _id: id });
            if (!auths || auths.length == 0) {
                res.status(400).json({ status: false, message: "User does not exist" });
            }
            req.auth = auths[0];
            next();
        }
        catch (error) {
            logger_1.default.error(`Error logging out: ${error}`);
            res.json({ status: false, message: error.message });
        }
    }));
});
exports.authenticateUserToken = authenticateUserToken;
