"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 4001,
    env: process.env.NODE_ENV || 'development',
    jwt: process.env.JWT_SECRET || "",
    refreshToken: process.env.REFRESH_TOKEN_SECRET || "",
    accessToken: process.env.ACCESS_TOKEN_SECRET || "",
    stmp: [
        {
            password: process.env.STMP_PASSWORD_0 || "",
            email: process.env.STMP_EMAIL_0 || ""
        },
        {
            password: process.env.STMP_PASSWORD_1 || "",
            email: process.env.STMP_EMAIL_1 || ""
        }
    ],
    db: {
        type: process.env.DB_TYPE || "",
        connectionString: process.env.MONGO_URI || ""
    },
    vapid: {
        public: process.env.VAPID_PUBLIC_KEY || "",
        private: process.env.VAPID_PRIVATE_KEY || ""
    },
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
};
// export default config;
exports.default = config;
