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
const mongoose_1 = __importStar(require("mongoose"));
const matchedMarketSchema = new mongoose_1.Schema({
    sport: { type: String, required: true, comment: "eg football" },
    bookmaker: { type: String, required: true, comment: "eg bet9ja" },
    bookmakerMarket: { type: String, required: true, comment: "Filename of bookmaker sport market eg bet9ja.football.json" },
    ourMarketMock: { type: String, required: true, comment: "Filename of our market mock eg football.mock.json" },
    ourMarketDefinition: { type: String, required: true, comment: "Filename of our market definition eg football.definition.json" },
    matchedMarkets: { type: Object, required: true, comment: "matched markets done by admin" },
    translatedMarkets: { type: Object, required: true, comment: "bookmaker translated markets done by the dependency injection function and edited by admin" },
    status: { type: Number, required: true, default: 1, comment: "-1: hide, 1:visible" }
}, { timestamps: true });
exports.default = mongoose_1.default.model('matched_market', matchedMarketSchema);
