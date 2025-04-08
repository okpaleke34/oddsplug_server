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
const userDetailSchema = new mongoose_1.Schema({
    authId: { type: mongoose_1.default.Types.ObjectId, ref: 'Auth', required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    country: { type: String, required: false },
    level: { type: String, required: false },
    dob: { type: String, required: false },
    address: { type: Object, required: false },
    settings: { type: Object, required: false },
    referral: { type: String, required: false },
    affiliateCode: { type: String, required: false, comment: "If a user has an affiliate code it means they are influencer that can share their code" },
    access: { type: String, required: false },
    lastLogin: { type: String, required: false },
    lastSeen: { type: String, required: false },
    lastIP: { type: String, required: false },
    registeredIP: { type: String, required: false },
    registeredOn: { type: String, required: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model('user_detail', userDetailSchema);
