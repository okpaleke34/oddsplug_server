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
const userBetSchema = new mongoose_1.Schema({
    authId: { type: mongoose_1.default.Types.ObjectId, ref: 'Auth', required: true },
    betId: { type: mongoose_1.default.Types.ObjectId, required: true },
    betType: { type: String, required: true, comment: "The collection to find the opportunity eg arbitrage, valuebet, middlebet" },
    historyLength: { type: Number, required: false, default: null, comment: "So these are number of history of the bet, if the history number is no the same when looking of it, it means that the bet has been updated and should be found in the history[historyLength]" },
    calculatorValues: { type: Object, required: true, comment: "The final value in the calculator" },
    status: { type: Number, required: true, default: 1, comment: "-1: deleted, 1:visible" }
}, { timestamps: true });
exports.default = mongoose_1.default.model('user_bet', userBetSchema);
