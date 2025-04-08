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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const arbitrageSchema = new mongoose_1.Schema({
    tournament: { type: String, required: true },
    marketCode: { type: String, required: true, comment: 'ft_dnb' },
    arbPercentage: { type: Number, required: true, comment: '4.23' },
    arbId: { type: String, required: true, comment: 'MMHHDDMM-bookmarker1-bookmarker2-team1-team2-marketCode-gameType hashed' },
    matchId: { type: String, required: true, comment: 'MMHHDDMM-team1_bigchar/id-team2_bigchar/id hashed' },
    hash: { type: String, required: true, comment: 'Hash of match data' },
    arbStorageId: { type: String, required: true },
    scanId: { type: String, required: true },
    sport: { type: String, required: true, comment: 'Football' },
    gameType: { type: String, required: true, comment: 'Prematch,Live' },
    bookmakers: { type: [Object], comment: '{bookmaker:bet9ja,teams:Arsenal vs chelsea,market:ov,odd:2.3,odds:[2.3,1.5]}' },
    firstScannedAt: { type: String, required: true },
    startAt: { type: String, required: true },
    lastScannedAt: { type: String, required: true },
    lastScanId: { type: String, required: true },
    won: { type: Number, comment: '0:money back; 1:first market won;2:second market won;3:third market won' },
    result: { type: String, comment: 'match result: 1-0' },
    history: { type: [Object], comment: '[{updatedAt, bookmakers,scanId}]', default: [] },
    status: { type: Number, required: true, default: 1, comment: '-1:expired(No longer in found in the website/odd changed);0:hidden(hidden by bot because 5mins>lastScannedAt);1:visible;2:hidden by admin(Do not update again)' }
}, { timestamps: {
        currentTime: () => (0, moment_timezone_1.default)().tz('Africa/Lagos').toDate()
    }
});
exports.default = mongoose_1.default.model('Arbitrage', arbitrageSchema);
